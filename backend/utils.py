import io
from pypdf import PdfReader
from docx import Document

def extract_text(filename: str, content: bytes) -> str:
    """Extract text from PDF or DOCX."""
    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""
            return text
            
        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            return "\n".join([para.text for para in doc.paragraphs])
            
        else:
            # Fallback for .txt
            return content.decode("utf-8", errors="ignore")
            
    except Exception as e:
        raise ValueError(f"Failed to parse {filename}: {str(e)}")