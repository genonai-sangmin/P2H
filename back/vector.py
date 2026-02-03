import weaviate  # 주석 해제 필수
from weaviate.classes.query import Filter
# 내부 컨버터 임포트 제거 (v4에서는 불필요)
from embedding import embedding_serving


class vectordb:
    def __init__(self, genos_ip:str = "llmops-weaviate-service", 
                 http_port: int = 8080, 
                 grpc_port: int = 50051,
                 idx:str = None,
                 embedding_serving_id:int = 10,
                 embedding_bearer_token:str = '1ed5a9dbe58043219b6c1be758910450',
                 embedding_genos_url:str = 'https://genos.genon.ai:3443'):
        self.client = None
        
        # 1. Weaviate 연결 로직 (v4 connect_to_custom)
        try:
            self.client = weaviate.connect_to_custom(
                http_host=genos_ip,
                http_port=http_port,
                http_secure=False,
                grpc_host=genos_ip,
                grpc_port=grpc_port,
                grpc_secure=False,
                
            )
            print(f'Weaviate 접속 성공: {genos_ip}:{http_port}')
        except Exception:
            try:
                self.client = weaviate.connect_to_custom(
                    http_host="192.168.74.171",
                    http_port=32208,
                    http_secure=False,
                    grpc_host="192.168.74.171",
                    grpc_port=32122,
                    grpc_secure=False,
                )
                print('Weaviate 접속 성공: 192.168.74.171:32208')
            except Exception as e:
                print(f'Weaviate 접속 실패: {e}')

        # 2. 컬렉션 설정
        self.collection = None
        if not idx:
            print('벡터 인덱스가 설정되지 않았습니다.')
        else:
            self.collection = self.client.collections.get(idx)
            print(f'VDB 컬렉션 [{idx}] 설정 완료.')

        # 3. 임베딩 설정
        self.emb = embedding_serving(
            serving_id=embedding_serving_id, 
            bearer_token=embedding_bearer_token,
            genos_url=embedding_genos_url
        )
        
        # self.converter 제거 (v4에서는 Filter 객체를 직접 사용합니다)

    def close(self):
        """Close underlying Weaviate connection to avoid ResourceWarning/leaks."""
        try:
            if self.client is not None:
                self.client.close()
        except Exception:
            # Best-effort close
            pass
        finally:
            self.client = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()
        return False

    def dense_search(self, query:str, topk = 4):
        vector = self.emb.call(query)[0]['embedding']
        results = [i.properties for i in self.collection.query.near_vector(near_vector=vector, limit=topk).objects]
        return results
    
    def bm25_search(self, query:str, topk = 4):
        results = [i.properties for i in self.collection.query.bm25(query, limit=topk).objects]
        return results
    
    def hybrid_search(self, query:str, topk:int = 4, alpha:float = 0.5):
        vector = self.emb.call(query)[0]['embedding']
        results = [i.properties for i in self.collection.query.hybrid(
            query=query, vector=vector, alpha=alpha, limit=topk
        ).objects]
        return results

    def hybrid_search_with_filter(self, query:str, filter_obj: any = None, topk:int = 4, alpha:float = 0.5):
        """
        v4에서는 'filter'라는 문자열 대신 'Filter' 객체를 인자로 받는 것이 표준입니다.
        만약 외부에서 JSON 형태의 필터가 들어온다면 Filter.by_property 등을 사용해 구성해야 합니다.
        """
        vector = self.emb.call(query)[0]['embedding']
        
        try:
            # filters 인자에 직접 Filter 객체를 전달합니다.
            query_result = self.collection.query.hybrid(
                query=query, 
                vector=vector,
                alpha=alpha, 
                limit=topk,
                filters=filter_obj  # Filter.by_property(...) 형태로 전달된 객체
            )
            return [i.properties for i in query_result.objects]
            
        except Exception as e:
            print(f'필터 적용 중 오류 발생: {e}')
            # 오류 시 필터 없이 검색
            res = self.hybrid_search(query, topk, alpha)
            return [{'message': '필터가 적용되지 않았습니다.'}] + res

    def show_documents(self):
        query_return = self.collection.query.fetch_objects(
            limit=10000,
            return_properties=['file_name']
        )
        # 중복 제거된 파일 이름 리스트
        file_names = list(set(i.properties['file_name'] for i in query_return.objects if 'file_name' in i.properties))
        return file_names

    def search_from_file_name(self, query:str, file_name_pattern: str, topk=4):
        vector = self.emb.call(query)[0]['embedding']
        query_return = self.collection.query.hybrid(
            query=query,
            limit=topk,
            filters=Filter.by_property("file_name").like(file_name_pattern),
            vector=vector
        )
        return [i.properties for i in query_return.objects]