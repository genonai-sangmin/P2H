from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rag import get_contents_by_file_name
from rag import show_documents

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the HPC RAG Service"}

@app.get("/show_files")
def show_files():
    doc_list={"files": show_documents()}
    return doc_list

@app.get("/files/{file_name}")
def read_file(file_name: str):
    results = get_contents_by_file_name(file_name)
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)