export function RolePlayCard({ situation }: { situation: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-4 text-white shadow-soft">
      <p className="text-sm font-bold opacity-80">Role-play vaziyat</p>
      <h3 className="mt-2 text-xl font-black">{situation}</h3>
      <p className="mt-2 text-sm opacity-90">Ruscha javob bering. Coach xatoni tuzatib, suhbatni davom ettiradi.</p>
    </div>
  );
}
