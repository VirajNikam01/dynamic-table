const roles = ["Admin", "Editor", "Viewer"];
const statuses = ["Active", "Inactive", "Pending"];
const departments = ["HR", "Engineering", "Marketing", "Sales"];

const allUsers = Array.from({ length: 187 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: roles[i % roles.length],
  status: statuses[i % statuses.length],
  department: departments[i % departments.length],
  age: 20 + (i % 30),
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export function fetchUsers({
  page = 1,
  pageSize = 10,
  sort = "name",
  order = "asc",
}) {
  const sorted = [...allUsers].sort((a, b) => {
    if (a[sort] < b[sort]) return order === "asc" ? -1 : 1;
    if (a[sort] > b[sort]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * pageSize;
  const paginated = sorted.slice(start, start + pageSize);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: paginated, total: allUsers.length });
    }, 500);
  });
}
