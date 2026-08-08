import json
from pathlib import Path
from typing import List, Optional, Dict
import logging

from models.schemas import CurriculumData, CurriculumDay, CurriculumModule

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

    def search_topics(self, keyword: str) -> List[CurriculumDay]:
        """Search days by keyword in title, tools, or objectives."""
        keyword_lower = keyword.lower()
        results = []
        for day in self.curriculum.days:
            if (keyword_lower in day.title.lower() or
                any(keyword_lower in t.lower() for t in day.tools) or
                any(keyword_lower in obj.lower() for obj in day.objectives)):
                results.append(day)
        return results

# Singleton instance for easy application access
curriculum_retriever = CurriculumRetriever()
