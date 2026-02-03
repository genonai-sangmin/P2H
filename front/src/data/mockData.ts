// Mock Data Structure for PDF, HTML, and Chunks
export interface Chunk {
  id: string;
  page: number;
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface PageData {
  pageNumber: number;
  htmlContent: string;
  chunks: Chunk[];
}

export const mockPageData: Record<number, PageData> = {
  1: {
    pageNumber: 1,
    htmlContent: `
      <div class="page-content">
        <h1>소프트웨어 개발 가이드</h1>
        <h2>제1장: 시작하기</h2>
        <p>이 문서는 현대적인 소프트웨어 개발을 위한 종합 가이드입니다. 
        React, TypeScript, 그리고 최신 웹 기술을 활용한 애플리케이션 개발 방법을 다룹니다.</p>
        <h3>1.1 개발 환경 설정</h3>
        <p>개발을 시작하기 전에 필요한 도구들을 설치해야 합니다. 
        Node.js, npm, 그리고 코드 에디터가 필수적입니다.</p>
        <h3>1.2 프로젝트 구조</h3>
        <p>잘 구성된 프로젝트 구조는 유지보수와 확장성을 크게 향상시킵니다. 
        컴포넌트, 유틸리티, 스타일을 적절히 분리하세요.</p>
      </div>
    `,
    chunks: [
      {
        id: "chunk-1-1",
        page: 1,
        title: "문서 제목 및 소개",
        content: "소프트웨어 개발 가이드 - 제1장: 시작하기. 이 문서는 현대적인 소프트웨어 개발을 위한 종합 가이드입니다.",
        startIndex: 0,
        endIndex: 250
      },
      {
        id: "chunk-1-2",
        page: 1,
        title: "개발 환경 설정",
        content: "개발을 시작하기 전에 필요한 도구들을 설치해야 합니다. Node.js, npm, 그리고 코드 에디터가 필수적입니다.",
        startIndex: 251,
        endIndex: 350
      },
      {
        id: "chunk-1-3",
        page: 1,
        title: "프로젝트 구조",
        content: "잘 구성된 프로젝트 구조는 유지보수와 확장성을 크게 향상시킵니다. 컴포넌트, 유틸리티, 스타일을 적절히 분리하세요.",
        startIndex: 351,
        endIndex: 500
      }
    ]
  },
  2: {
    pageNumber: 2,
    htmlContent: `
      <div class="page-content">
        <h2>제2장: React 기초</h2>
        <h3>2.1 컴포넌트란?</h3>
        <p>React 컴포넌트는 UI를 구성하는 독립적이고 재사용 가능한 코드 조각입니다. 
        함수형 컴포넌트와 클래스형 컴포넌트가 있으며, 현대적인 개발에서는 주로 함수형을 사용합니다.</p>
        <h3>2.2 State와 Props</h3>
        <p>State는 컴포넌트 내부에서 관리되는 데이터이며, Props는 부모로부터 전달받는 데이터입니다. 
        이 두 개념을 잘 이해하는 것이 React 개발의 핵심입니다.</p>
        <h3>2.3 Hooks 활용</h3>
        <p>useState, useEffect, useRef 등의 Hooks를 통해 함수형 컴포넌트에서도 
        상태 관리와 생명주기 메서드를 활용할 수 있습니다.</p>
      </div>
    `,
    chunks: [
      {
        id: "chunk-2-1",
        page: 2,
        title: "React 컴포넌트 소개",
        content: "React 컴포넌트는 UI를 구성하는 독립적이고 재사용 가능한 코드 조각입니다. 함수형 컴포넌트와 클래스형 컴포넌트가 있습니다.",
        startIndex: 0,
        endIndex: 200
      },
      {
        id: "chunk-2-2",
        page: 2,
        title: "State와 Props 이해하기",
        content: "State는 컴포넌트 내부에서 관리되는 데이터이며, Props는 부모로부터 전달받는 데이터입니다.",
        startIndex: 201,
        endIndex: 350
      },
      {
        id: "chunk-2-3",
        page: 2,
        title: "Hooks 활용법",
        content: "useState, useEffect, useRef 등의 Hooks를 통해 함수형 컴포넌트에서도 상태 관리와 생명주기 메서드를 활용할 수 있습니다.",
        startIndex: 351,
        endIndex: 500
      }
    ]
  },
  3: {
    pageNumber: 3,
    htmlContent: `
      <div class="page-content">
        <h2>제3장: 고급 패턴</h2>
        <h3>3.1 Context API</h3>
        <p>Context API는 props drilling 없이 전역 상태를 관리할 수 있게 해줍니다. 
        테마, 언어 설정, 사용자 인증 정보 등을 관리하는데 유용합니다.</p>
        <h3>3.2 Custom Hooks</h3>
        <p>반복되는 로직을 커스텀 훅으로 추출하면 코드의 재사용성이 높아집니다. 
        useLocalStorage, useFetch 같은 유틸리티 훅을 만들어 활용하세요.</p>
        <h3>3.3 성능 최적화</h3>
        <p>React.memo, useMemo, useCallback을 활용하여 불필요한 리렌더링을 방지하고 
        애플리케이션의 성능을 향상시킬 수 있습니다.</p>
      </div>
    `,
    chunks: [
      {
        id: "chunk-3-1",
        page: 3,
        title: "Context API 활용",
        content: "Context API는 props drilling 없이 전역 상태를 관리할 수 있게 해줍니다. 테마, 언어 설정, 사용자 인증 정보 등을 관리하는데 유용합니다.",
        startIndex: 0,
        endIndex: 180
      },
      {
        id: "chunk-3-2",
        page: 3,
        title: "Custom Hooks 만들기",
        content: "반복되는 로직을 커스텀 훅으로 추출하면 코드의 재사용성이 높아집니다. useLocalStorage, useFetch 같은 유틸리티 훅을 만들어 활용하세요.",
        startIndex: 181,
        endIndex: 350
      },
      {
        id: "chunk-3-3",
        page: 3,
        title: "성능 최적화 기법",
        content: "React.memo, useMemo, useCallback을 활용하여 불필요한 리렌더링을 방지하고 애플리케이션의 성능을 향상시킬 수 있습니다.",
        startIndex: 351,
        endIndex: 500
      }
    ]
  },
  4: {
    pageNumber: 4,
    htmlContent: `
      <div class="page-content">
        <h2>제4장: 상태 관리</h2>
        <h3>4.1 Redux Toolkit</h3>
        <p>Redux Toolkit은 Redux의 보일러플레이트를 크게 줄여줍니다. 
        createSlice, createAsyncThunk를 활용하여 효율적으로 상태를 관리할 수 있습니다.</p>
        <h3>4.2 Zustand</h3>
        <p>Zustand는 가볍고 사용하기 쉬운 상태 관리 라이브러리입니다. 
        Redux보다 간단한 API를 제공하면서도 강력한 기능을 갖추고 있습니다.</p>
        <h3>4.3 상태 관리 전략</h3>
        <p>애플리케이션의 규모와 복잡도에 따라 적절한 상태 관리 도구를 선택하세요. 
        작은 프로젝트는 Context API로도 충분하지만, 대규모 프로젝트는 Redux나 Zustand가 필요합니다.</p>
      </div>
    `,
    chunks: [
      {
        id: "chunk-4-1",
        page: 4,
        title: "Redux Toolkit 소개",
        content: "Redux Toolkit은 Redux의 보일러플레이트를 크게 줄여줍니다. createSlice, createAsyncThunk를 활용하여 효율적으로 상태를 관리할 수 있습니다.",
        startIndex: 0,
        endIndex: 180
      },
      {
        id: "chunk-4-2",
        page: 4,
        title: "Zustand 라이브러리",
        content: "Zustand는 가볍고 사용하기 쉬운 상태 관리 라이브러리입니다. Redux보다 간단한 API를 제공하면서도 강력한 기능을 갖추고 있습니다.",
        startIndex: 181,
        endIndex: 350
      },
      {
        id: "chunk-4-3",
        page: 4,
        title: "상태 관리 전략 수립",
        content: "애플리케이션의 규모와 복잡도에 따라 적절한 상태 관리 도구를 선택하세요. 작은 프로젝트는 Context API로도 충분합니다.",
        startIndex: 351,
        endIndex: 520
      }
    ]
  },
  5: {
    pageNumber: 5,
    htmlContent: `
      <div class="page-content">
        <h2>제5장: 테스팅</h2>
        <h3>5.1 단위 테스트</h3>
        <p>Jest와 React Testing Library를 활용하여 컴포넌트의 단위 테스트를 작성하세요. 
        테스트는 코드의 품질을 보장하고 리팩토링을 안전하게 만듭니다.</p>
        <h3>5.2 통합 테스트</h3>
        <p>여러 컴포넌트가 함께 작동하는지 확인하는 통합 테스트도 중요합니다. 
        사용자 시나리오를 기반으로 테스트를 작성하면 실제 사용 환경을 잘 반영할 수 있습니다.</p>
        <h3>5.3 E2E 테스트</h3>
        <p>Cypress나 Playwright를 사용하여 전체 애플리케이션의 플로우를 테스트하세요. 
        E2E 테스트는 사용자 관점에서 앱이 제대로 작동하는지 확인합니다.</p>
      </div>
    `,
    chunks: [
      {
        id: "chunk-5-1",
        page: 5,
        title: "단위 테스트 작성",
        content: "Jest와 React Testing Library를 활용하여 컴포넌트의 단위 테스트를 작성하세요. 테스트는 코드의 품질을 보장합니다.",
        startIndex: 0,
        endIndex: 180
      },
      {
        id: "chunk-5-2",
        page: 5,
        title: "통합 테스트 방법",
        content: "여러 컴포넌트가 함께 작동하는지 확인하는 통합 테스트도 중요합니다. 사용자 시나리오를 기반으로 테스트를 작성하세요.",
        startIndex: 181,
        endIndex: 350
      },
      {
        id: "chunk-5-3",
        page: 5,
        title: "E2E 테스트 전략",
        content: "Cypress나 Playwright를 사용하여 전체 애플리케이션의 플로우를 테스트하세요. E2E 테스트는 사용자 관점에서 앱이 제대로 작동하는지 확인합니다.",
        startIndex: 351,
        endIndex: 550
      }
    ]
  }
};

// Sample PDF URL for demonstration
// Using a publicly accessible PDF with CORS enabled
export const SAMPLE_PDF_URL = "https://pdfobject.com/pdf/sample.pdf";
