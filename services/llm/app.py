from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI()


class FeedbackRequest(BaseModel):
    transcript: Optional[str] = None
    audioBytesBase64: Optional[str] = None


class PronunciationIssue(BaseModel):
    word: str
    suggestion: str
    score: float


class FeedbackResponse(BaseModel):
    summary: str
    pronunciation: List[PronunciationIssue]
    tips: List[str]


@app.get("/health")
def health():
    return {"status": "ok", "service": "llm"}


@app.post("/feedback", response_model=FeedbackResponse)
def feedback(req: FeedbackRequest):
    # Mock logic: if transcript exists, analyze words; otherwise generic advice
    issues: List[PronunciationIssue] = []
    text = (req.transcript or "").strip()
    words = text.split() if text else []

    # Very naive mock: flag words with 'r' and 'th' as commonly difficult
    for w in words:
        lw = w.lower()
        if "th" in lw:
            issues.append(PronunciationIssue(
                word=w,
                suggestion="Place tongue between teeth and exhale softly for 'th'.",
                score=0.65,
            ))
        if "r" in lw:
            issues.append(PronunciationIssue(
                word=w,
                suggestion="Relax the tongue tip and avoid rolling the 'r'.",
                score=0.7,
            ))

    if not issues:
        issues.append(PronunciationIssue(
            word=words[0] if words else "(audio)",
            suggestion="Speak slowly and clearly; stress content words in the sentence.",
            score=0.8,
        ))

    tips = [
        "Record yourself and compare with native pronunciation.",
        "Focus on stressed syllables; reduce function words.",
        "Maintain steady rhythm; avoid trailing off at sentence ends.",
    ]

    summary = (
        "Good effort! Pay attention to a few consonants and rhythm."
        if issues
        else "Clear pronunciation. Keep practicing for fluency."
    )

    return FeedbackResponse(summary=summary, pronunciation=issues, tips=tips)

