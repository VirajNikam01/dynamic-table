# 🧩 Dynamic Table

A modern, minimal, and highly customizable React data table component with sorting, pagination, selection, shimmer loading, and more.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-dynamic--table-181717?logo=github)](https://github.com/VirajNikam01/dynamic-table.git)

---

## ✨ Features

- ⚡ **Fast**: Virtualized rendering for large datasets
- 🎨 **Minimal UI**: Clean, modern, and responsive design
- 🔍 **Sorting**: Click column headers to sort
- 📄 **Pagination**: Easy navigation with page size control
- ✅ **Row Selection**: Multi-select with checkboxes
- 🦴 **Shimmer Loading**: Beautiful skeleton loader while fetching data
- 🛠️ **Customizable**: Pass your own columns, headers, and cell renderers
- 🧩 **Composable**: Use as a standalone component or integrate into your app

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/VirajNikam01/dynamic-table.git
cd dynamic-table
npm install
# or
yarn install
```

### 2. Run the app

```bash
npm run dev
# or
yarn dev
```

---

## 🛠 Usage

```jsx
import DataListingTable from "@/components/tables/data-listing-table";


<DataListingTable
  columns={columns}
  query={query}
  onSortChange={setSortBy}
  page={page}
  pageSize={pageSize}
  total={query.data?.total || 0}
  setPage={setPage}
  setPageSize={setPageSize}
  selectable={true}
  header={<PremiumUsersHeader />}
/>
```

---


## 📦 Dependencies

- [React](https://react.dev/)
- [@tanstack/react-table](https://tanstack.com/table)
- [@tanstack/react-query](https://tanstack.com/query)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📝 License

This project is [MIT](LICENSE) licensed.

---

## 🌐 Links

- [GitHub Repo](https://github.com/VirajNikam01/dynamic-table.git)

---

> Made with ❤️ by [Viraj Nikam](https://github.com/VirajNikam01)