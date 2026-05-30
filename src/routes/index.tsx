import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNotes } from "@/hooks/useNotes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bloco de Notas" },
      { name: "description", content: "Bloco de notas simples com salvamento automático no navegador." },
      { property: "og:title", content: "Bloco de Notas" },
      { property: "og:description", content: "Bloco de notas simples com salvamento automático no navegador." },
    ],
  }),
  component: NotepadPage,
});

function formatDate(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotepadPage() {
  const { notes, active, activeId, setActiveId, createNote, updateNote, deleteNote } = useNotes();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    );
  }, [notes, query]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="flex w-80 flex-col border-r border-border">
        <div className="flex items-center justify-between gap-2 border-b border-border p-4">
          <h1 className="text-lg font-semibold tracking-tight">Notas</h1>
          <Button size="sm" onClick={() => createNote()}>
            <Plus className="mr-1 h-4 w-4" /> Nova
          </Button>
        </div>
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="pl-8"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              {notes.length === 0 ? "Nenhuma nota ainda" : "Nada encontrado"}
            </div>
          ) : (
            <ul className="p-2">
              {filtered.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => setActiveId(n.id)}
                    className={cn(
                      "w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-accent",
                      activeId === n.id && "bg-accent",
                    )}
                  >
                    <div className="truncate text-sm font-medium">
                      {n.title || "Sem título"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {n.content.split("\n")[0] || "Vazio"}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {formatDate(n.updatedAt)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </aside>

      <main className="flex flex-1 flex-col">
        {active ? (
          <>
            <div className="flex items-center justify-between gap-2 border-b border-border p-4">
              <Input
                value={active.title}
                onChange={(e) => updateNote(active.id, { title: e.target.value })}
                placeholder="Título da nota"
                className="border-0 bg-transparent text-xl font-semibold shadow-none focus-visible:ring-0"
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Excluir nota">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir esta nota?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteNote(active.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Textarea
              value={active.content}
              onChange={(e) => updateNote(active.id, { content: e.target.value })}
              placeholder="Comece a escrever..."
              className="flex-1 resize-none rounded-none border-0 p-6 text-base leading-relaxed shadow-none focus-visible:ring-0"
            />
            <div className="border-t border-border px-6 py-2 text-xs text-muted-foreground">
              Salvo automaticamente · {formatDate(active.updatedAt)}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
            <FileText className="h-10 w-10" />
            <p className="text-sm">Selecione uma nota ou crie uma nova</p>
            <Button onClick={() => createNote()}>
              <Plus className="mr-1 h-4 w-4" /> Nova nota
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
