import json
from pathlib import Path
from typing import List, Optional, Dict
import logging

from models.schemas import CandidatesData, CandidatePayload, CandidateMission

logger = logging.getLogger("ai-interview-agent.candidate_loader")

class CandidateLoader:
    def __init__(self, data_path: Optional[Path] = None):
        if data_path is None:
            data_path = Path(__file__).parent.parent / "data" / "candidates.json"
        
        self.data_path = Path(data_path)
        self.data: CandidatesData = self._load_candidates()
        self._candidate_map: Dict[str, CandidatePayload] = {
            c.member.id: c for c in self.data.candidates
        }

    def _load_candidates(self) -> CandidatesData:
        if not self.data_path.exists():
            raise FileNotFoundError(f"Candidate file not found at {self.data_path}")
        
        with open(self.data_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        
        data = CandidatesData.model_validate(raw_data)
        logger.info(f"Loaded {len(data.candidates)} candidates from {self.data_path}")
        return data

    def get_candidate(self, candidate_id: str) -> Optional[CandidatePayload]:
        """Retrieve a candidate by candidate ID e.g. CAND-001."""
        return self._candidate_map.get(candidate_id)

    def get_completed_days(self, candidate: CandidatePayload) -> List[int]:
        """Get list of day numbers where candidate passed the mission."""
        return [m.day for m in candidate.missions if m.passed is True]

    def get_skipped_days(self, candidate: CandidatePayload) -> List[int]:
        """Get list of day numbers where candidate skipped the mission."""
        return [m.day for m in candidate.missions if m.skipped is True]

    def get_failed_days(self, candidate: CandidatePayload) -> List[int]:
        """Get list of day numbers where candidate failed the mission."""
        return [m.day for m in candidate.missions if m.passed is False]

    def get_all_encountered_days(self, candidate: CandidatePayload) -> List[int]:
        """Get all day numbers present in candidate's mission history."""
        return [m.day for m in candidate.missions]

# Singleton instance
candidate_loader = CandidateLoader()
