import { Link } from "@tanstack/react-router";

export function Participe() {
  return (
    <section className="grad-copa py-12 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="display mb-3 text-3xl md:text-5xl">PARTICIPE AGORA!</h2>
        <p className="mx-auto mb-6 max-w-xl text-lg opacity-95">
          Anime, cadastre-se na ação e venha torcer pelo seu bairro. Clientes ou não clientes — todo mundo tem chance!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/participar"
            className="rounded-full bg-white px-8 py-3 text-base font-bold text-laranja shadow hover:bg-amarelo"
          >
            Quero participar
          </Link>
          <a
            href="https://www.rapidin.net.br/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-white px-8 py-3 text-base font-bold text-white hover:bg-white hover:text-laranja"
          >
            Contratar internet
          </a>
        </div>
      </div>
    </section>
  );
}
