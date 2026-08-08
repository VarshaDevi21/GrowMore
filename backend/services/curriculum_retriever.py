import json
from pathlib import Path
from typing import List, Optional, Dict, Set
import logging

from models.schemas import CurriculumData, CurriculumDay, CurriculumModule, CandidatePayload

logger = logging.getLogger("ai-interview-agent.curriculum")

class CurriculumRetriever:
    def __init__(self, data_path: Optional[Path] = None):
        if data_path is None:
            data_path = Path(__file__).parent.parent / "data" / "curriculum.json"
        
        self.data_path = Path(data_path)
        self.curriculum: CurriculumData = self._load_curriculum()
        self._days_map: Dict[int, CurriculumDay] = {d.day: d for d in self.curriculum.days}

    def _load_curriculum(self) -> CurriculumData:
        if not self.data_path.exists():
            raise FileNotFoundError(f"Curriculum file not found at {self.data_path}")
        
        with open(self.data_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        
        curriculum = CurriculumData.model_validate(raw_data)
        logger.info(f"Loaded curriculum with {len(curriculum.days)} days across {len(curriculum.modules)} modules.")
        return curriculum

    def get_day(self, day_num: int) -> Optional[CurriculumDay]:
        """Retrieve a specific day by day number."""
        return self._days_map.get(day_num)

    def get_all_days(self) -> List[CurriculumDay]:
        """Retrieve all curriculum days."""
        return self.curriculum.days

    def get_module_for_day(self, day_num: int) -> Optional[CurriculumModule]:
        """Retrieve the module containing the given day number."""
        for mod in self.curriculum.modules:
            if len(mod.days) == 2 and mod.days[0] <= day_num <= mod.days[1]:
                return mod
        return None

    def get_candidate_encountered_days(self, candidate: CandidatePayload) -> List[CurriculumDay]:
        """
        Retrieve curriculum days that the candidate has actually encountered in their mission history.
        Filters out any day numbers not present in the candidate's missions.
        """
        encountered_day_nums = {m.day for m in candidate.missions}
        return [self._days_map[day_num] for day_num in sorted(encountered_day_nums) if day_num in self._days_map]

    def select_next_probing_day(
        self,
        candidate: CandidatePayload,
        covered_days: List[int],
        demonstrated_gaps: Optional[List[str]] = None
    ) -> Optional[CurriculumDay]:
        """
        Selects the next curriculum day to probe during the interview.
        Rules:
        1. Must belong to the candidate's encountered missions.
        2. Must NOT be in already covered_days (unless all encountered days are exhausted).
        3. Prioritizes days with skipped or failed missions, or mentioned gaps.
        4. Guarantees selection of valid curriculum days only.
        """
        encountered = self.get_candidate_encountered_days(candidate)
        covered_set = set(covered_days)
        uncovered = [d for d in encountered if d.day not in covered_set]

        if not uncovered:
            # Fallback: if all encountered days have been touched, cycle back to encountered days
            uncovered = encountered

        if not uncovered:
            return None

        # Priority 1: Check if candidate has skipped or failed missions in uncovered days
        failed_or_skipped_days = {
            m.day for m in candidate.missions if m.skipped is True or m.passed is False
        }
        priority_days = [d for d in uncovered if d.day in failed_or_skipped_days]
        if priority_days:
            selected = priority_days[0]
            logger.info(f"Selected priority (skipped/failed) curriculum day: Day {selected.day} - {selected.title}")
            return selected

        # Priority 2: Check if any uncovered day matches demonstrated gaps keywords
        if demonstrated_gaps:
            for gap in demonstrated_gaps:
                gap_lower = gap.lower()
                for day in uncovered:
                    if (gap_lower in day.title.lower() or
                        any(gap_lower in t.lower() for t in day.tools) or
                        any(gap_lower in obj.lower() for obj in day.objectives)):
                        logger.info(f"Selected gap-matched curriculum day: Day {day.day} - {day.title}")
                        return day

        # Priority 3: Pick the first available uncovered encountered day
        selected = uncovered[0]
        logger.info(f"Selected next uncovered curriculum day: Day {selected.day} - {selected.title}")
        return selected

    def map_gap_to_recommendation(self, gap_topic: str) -> str:
        """
        Map a demonstrated skill gap to an exact curriculum recommendation string.
        Output format strictly follows contract:
        Day [actual day number] — [actual topic title] — Actionable study recommendation based on demonstrated gap.
        """
        gap_lower = gap_topic.lower()
        matched_day: Optional[CurriculumDay] = None

        # Search for exact or keyword match in curriculum days
        for day in self.curriculum.days:
            if (gap_lower in day.title.lower() or
                any(gap_lower in t.lower() for t in day.tools) or
                any(gap_lower in obj.lower() for obj in day.objectives)):
                matched_day = day
                break

        if matched_day:
            return f"Day {matched_day.day} — {matched_day.title} — Review objectives: {', '.join(matched_day.objectives[:2])}."
        
        # Fallback to general day match if no specific keyword match
        return f"Curriculum Review — {gap_topic} — Re-examine key concepts and tools related to {gap_topic}."

    def get_day_context_summary(self, day_num: int) -> str:
        """Construct a clean string summary of a curriculum day for LLM prompting."""
        day = self.get_day(day_num)
        if not day:
            return "General AI Engineering principles"
        
        tools_str = ", ".join(day.tools)
        objs_str = "; ".join(day.objectives)
        return f"Day {day.day}: {day.title} (Type: {day.type}). Tools: {tools_str}. Core Objectives: {objs_str}."

# Singleton instance
curriculum_retriever = CurriculumRetriever()
