from vector import vectordb

def get_contents_by_file_name(file_name_pattern: str) -> list:
    """
    [특정 약관 전수 조사 및 전체 내용 조회]
    특정 약관 번호나 키워드가 포함된 파일의 모든 페이지(청크)를 순서대로 가져옵니다. 

    Args:
        file_name_pattern (str): 찾고자 하는 파일명, 약관 번호, 또는 핵심 키워드
    """

    # 1. 인덱스 연결 (context manager로 자동 close)
    # idx를 지정하지 않으면 .env 또는 기본값을 사용합니다.
    with vectordb() as vdb:

        # 중복 로직을 처리하는 내부 함수
        def _fetch_and_process(pattern: str) -> list:
            # 패턴 보정 (와일드카드 추가)
            search_pattern = f"*{pattern}*" if "*" not in pattern else pattern

            raw_results = vdb.search_from_file_name(
                query="",
                file_name_pattern=search_pattern,
                topk=30
            )

            if not raw_results:
                return []

            # 데이터 가공 및 페이지 순 정렬
            processed = [
                {
                    'content': i.get('text', ''),
                    'file_name': i.get('file_name', ''),
                    'i_page': int(i.get('i_page', 0)),
                    'file_path': i.get('file_path', '')
                }
                for i in raw_results
            ]
            processed.sort(key=lambda x: x['i_page'])
            return processed

        # 2. 첫 번째 시도
        results = _fetch_and_process(file_name_pattern)

    return results

def show_documents() -> list:
    """
    저장된 문서(파일) 목록을 반환합니다.
    """
    with vectordb() as vdb:
        file_names = vdb.show_documents()
    return file_names