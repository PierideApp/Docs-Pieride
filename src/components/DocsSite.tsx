import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import { Icon } from "@/components/Icons";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { DocCategory, DocPage } from "@/lib/docs";
import { sitePath } from "@/lib/site-path";

function SearchDialog({pages,categories}:{pages:DocPage[];categories:DocCategory[]}) {
  const searchable=pages.filter((page)=>page.slug!=="index");
  return <div className="search-backdrop" data-search-dialog hidden role="presentation">
    <section className="search-dialog" role="dialog" aria-modal="true" aria-label="Rechercher dans la documentation">
      <div className="search-dialog-input"><Icon name="search" size={21}/><input data-search-input type="search" placeholder="Rechercher un guide ou une question…" aria-label="Rechercher un guide ou une question"/><kbd>ESC</kbd></div>
      <div className="search-dialog-results" data-search-results>
        {searchable.map((page)=>{
          const category=categories.find((item)=>item.slug===page.categorySlug);
          return <Link key={page.source} className="search-result" href={page.href} data-search-result data-search-text={(page.title+" "+page.description+" "+page.searchText+" "+(category?.name||"")).toLocaleLowerCase("fr")}>
            <span className="search-result-icon" data-category={category?.slug} style={{color:category?.accent}}><Icon name={category?.icon||"book"} size={17}/></span>
            <span className="search-result-copy"><strong>{page.title}</strong><small>{category?.name} · {page.description}</small></span><Icon name="arrow" size={16} className="search-result-arrow"/>
          </Link>;
        })}
        <p className="search-empty" data-search-empty hidden>Aucun guide ne correspond à cette recherche.</p>
      </div>
      <div className="search-dialog-hint"><span>↑ ↓ pour parcourir</span><span>Entrée pour ouvrir <kbd>Ctrl K</kbd></span></div>
    </section>
  </div>;
}

function Sidebar({categories,activeCategory,activeHref}:{categories:DocCategory[];activeCategory?:string;activeHref:string}) {
  return <div className="sidebar-inner">
    <Link href="/" className="brand">
      <img className="brand-mark" src={sitePath("/brand/pieride-icon.png")} alt=""/>
      <span className="brand-copy"><strong>Piéride</strong><small>Documentation</small></span>
    </Link>
    <p className="sidebar-intro">L’essentiel de ta vie scolaire, réuni au même endroit.</p>
    <button className="sidebar-search" type="button" data-search-open><span><Icon name="search" size={17}/>Rechercher</span><kbd>Ctrl K</kbd></button>
    <div className="sidebar-label">Explorer</div>
    <Link href="/" className={"sidebar-home"+(activeHref==="/"?" active":"")}><span className="sidebar-home-icon"><Icon name="home" size={17}/></span>Accueil</Link>
    <nav className="category-nav" aria-label="Catégories de documentation">
      {categories.map((category)=>{
        const open=activeCategory===category.slug, current=activeCategory===category.slug;
        const children=category.pages.filter((page)=>page.slug!=="index");
        return <section className={"sidebar-category"+(current?" current":"")+(open?" expanded":"")} key={category.slug} data-sidebar-category>
          <div className="sidebar-category-head">
            <Link href={category.href} className="sidebar-category-link" aria-current={activeHref===category.href?"page":undefined}>
              <span className="sidebar-category-icon" data-category={category.slug} style={{"--category-accent":category.accent} as CSSProperties}><Icon name={category.icon} size={17}/></span><span className="sidebar-category-name">{category.name}</span>
            </Link>
            {children.length>0&&<button className="sidebar-expand" type="button" aria-label={(open?"Réduire ":"Développer ")+category.name} aria-expanded={open} data-category-toggle><Icon name="chevron" size={15}/></button>}
          </div>
          {children.length>0&&<div className="sidebar-pages" data-sidebar-pages hidden={!open}>{children.map((page)=><Link key={page.source} href={page.href} className={"sidebar-page"+(activeHref===page.href?" active":"")} aria-current={activeHref===page.href?"page":undefined}>{page.title}</Link>)}</div>}
        </section>;
      })}
    </nav>
    <div className="sidebar-bottom"><div className="sidebar-bottom-flower">✳</div><p>Une documentation claire pour profiter de Piéride au quotidien.</p></div>
  </div>;
}

export function DocsSite({categories,pages,activeCategory,activeHref,children}:{categories:DocCategory[];pages:DocPage[];activeCategory?:string;activeHref:string;children:ReactNode}) {
  const currentCategory=categories.find((item)=>item.slug===activeCategory);
  const currentPage=pages.find((page)=>page.href===activeHref);
  return <div className="docs-shell">
    <aside className="sidebar"><Sidebar categories={categories} activeCategory={activeCategory} activeHref={activeHref}/></aside>
    <button className="sidebar-scrim" type="button" aria-label="Fermer le menu" data-menu-close hidden/>
    <div className="workspace">
      <header className="topbar">
        <div className="topbar-context"><button className="mobile-menu" type="button" data-menu-open aria-label="Ouvrir le menu"><Icon name="menu" size={20}/></button><span className="topbar-crumb">Piéride</span><Icon name="chevron" size={14}/><span className="topbar-current">{currentPage?.title||currentCategory?.name||"Documentation"}</span></div>
        <div className="topbar-actions"><button className="topbar-search" type="button" aria-label="Rechercher dans la documentation" data-search-open><Icon name="search" size={16}/><span>Rechercher…</span><kbd>Ctrl K</kbd></button><ThemeToggle/></div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer"><span>Piéride <i>✳</i></span><span>Une vie scolaire plus simple.</span></footer>
    </div>
    <SearchDialog pages={pages} categories={categories}/>
  </div>;
}
