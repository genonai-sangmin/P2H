import  httpx
import requests
class embedding_serving:
    def __init__(self, serving_id:int = 10, bearer_token:str = '1ed5a9dbe58043219b6c1be758910450',
                  genos_url:str = 'https://genos.genon.ai:3443'):
        self.serving_id = serving_id
        self.url = f"{genos_url}/api/gateway/rep/serving/{serving_id}"
        self.headers = dict(Authorization=f"Bearer {bearer_token}")
        if serving_id and bearer_token:
            print(f'embedding model: {serving_id}번과 토큰이 입력되었습니다.')
        else:
            print('serving id 혹은 인증키가 입력되지 않았습니다.')

    def call(self, question:str = '안녕?'):
        
        body = {
            "input" : [question]
        }
        endpoint = f"{self.url}/v1/embeddings"
        response = requests.post(endpoint, headers=self.headers, json=body)
        result = response.json()
        vector = result['data']
        return vector
    
    def call_batch(self, question:list = ['안녕?']):
        body = {
            "input" : question
        }
        endpoint = f"{self.url}/v1/embeddings"
        response = requests.post(endpoint, headers=self.headers, json=body)
        result = response.json()
        vector = result['data']
        return vector
    
    async def async_call(self, question = '안녕?'):
        body = {
            "input" : question
        }
        endpoint = f"{self.url}/v1/embeddings"
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
                response = await client.post(endpoint, headers=self.headers, json=body)
                result = response.json()
                vector = result['data']

        except KeyError as e:
            print(response.json())
            print(f'embedding 서빙 호출 중 keyerror 발생: {e}')
            return None
        except httpx.RequestError as e:
            print(f'embedding 서빙 호출 중 오류 발생 : {e}')
            return None
        return vector
    
    async def async_call_batch(self, question:list = '안녕?'):
        body = {
            "input" : [question]
        }
        endpoint = f"{self.url}/v1/embeddings"
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
                response = await client.post(endpoint, headers=self.headers, json=body)
                result = response.json()
                vector = result['data']

        except KeyError as e:
            print(response.json())
            print(f'embedding 서빙 호출 중 keyerror 발생: {e}')
            return None
        except httpx.RequestError as e:
            print(f'embedding 서빙 호출 중 오류 발생 : {e}')
            return None
        return vector
