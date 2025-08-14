# AnyAI UI Kit

AnyAIの洗練されたUIを、あらゆるプロジェクトで**すぐ・簡単に再現**するためのUIキットです。エンジニアはこのキットを使うだけで、デザインの細部を気にすることなく、高品質なUIを構築できます。

- **デモ:** [デモページ](https://path-to-your-demo-page.com)（デプロイ後にリンクを更新）
- **CSS CDN:** `https://path-to-your-cdn/output.css`（デプロイ後にリンクを更新）

---

## 設計思想

- **Utility-First:** [Tailwind CSS](https://tailwindcss.com/) をベースに、迅速な開発と高いカスタマイズ性を両立します。
- **Token-Based:** CSSカスタムプロパティ（`tokens.css`）でデザインの基本要素（色、余白、影）を定義。一貫性を保ちつつ、テーマの変更も容易です。
- **Component-Driven:** [React](https://react.dev/)製の再利用可能なコンポーネント群を提供。もちろん、React以外のプロジェクトでもCSSを適用するだけで同じ見た目を実現できます。

---

## 使いかた

### A) CSSだけで使う (React以外のプロジェクト)

最も簡単な方法です。HTMLファイルでCDN経由のCSSを読み込むだけ。

```html
<!doctype html>
<html>
<head>
  <title>My Awesome App</title>
  <link rel="stylesheet" href="httpss://path-to-your-cdn/output.css" />
</head>
<body>
  <!-- あとはデモ(index.html)を参考にクラス名を付けるだけ！ -->
  <button class="btn btn-primary">Hello AnyAI</button>
  <div class="card">
    <div class="card-header">Card Title</div>
    <div class="card-body">Card Content</div>
  </div>
</body>
</html>
```

### B) Reactプロジェクトで使う

コンポーネントをフル活用できます。

1.  **ファイル配置:**
    - `src/components` フォルダをあなたのプロジェクトにコピーします。
    - `tokens.css` と `tailwind.config.js` の内容を、あなたのプロジェクトの設定にマージします。

2.  **コンポーネント利用:**
    ```tsx
    import Button from './components/Button';
    import { Card, CardHeader, CardBody } from './components/Card';

    function MyPage() {
      return (
        <Card>
          <CardHeader>Welcome!</CardHeader>
          <CardBody>
            <p>This is AnyAI UI Kit.</p>
            <Button variant="primary" size="lg">Get Started</Button>
          </CardBody>
        </Card>
      );
    }
    ```

---

## コンポーネント一覧

| コンポーネント | 説明 | 使用例 |
| :--- | :--- | :--- |
| **Button** | 主要なアクションボタン | `<Button variant="primary">Click</Button>` |
| **Card** | 情報コンテナ | `<Card><CardHeader>...</CardHeader>...</Card>` |
| **Input** | テキスト入力 | `<Input placeholder="Search..." />` |
| **ChatBubble**| AIチャットの吹き出し | `<Bubble role="assistant">Hello!</Bubble>` |
| **Shell** | アプリ全体の骨格 | `<Shell>...main content...</Shell>` |
| **KPI** | 重要業績評価指標 | `<div class="kpi">...</div>` |

詳細は `src/index.html` のデモ実装を参照してください。

---

## ローカル開発

```bash
# 1) 依存のインストール
npm i

# 2) Tailwind を Watch してCSSビルド
npm run dev

# 3) ブラウザで src/index.html を開く
# (Live Serverなどの拡張機能を使うと便利です)
```