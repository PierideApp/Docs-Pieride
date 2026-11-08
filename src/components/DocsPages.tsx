import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/Icons";
import MarkdownDocument from "@/components/MarkdownDocument";
import type { DocCategory, DocPage } from "@/lib/docs";
import { sitePath } from "@/lib/site-path";

const accent=(category:DocCategory)=>({"--category-accent":category.accent} as CSSProperties);
const helpCategory=(categories:DocCategory[])=>categories.find((item)=>/aide|assistance/i.test(item.slug));

function PageCard({page,category}:{page:DocPage;category:DocCategory}) {
  return <Link className="page-card" href={page.href} data-category={category.slug} style={accent(category)}>
    <div className="page-card-cover">{page.cover?<img src={sitePath(page.cover)} alt="" loading="lazy"/>:<span className="page-card-icon"><Icon name={category.icon} size={27}/></span>}</div>
    <div className="page-card-copy"><span className="page-card-category">{category.name}</span><h3>{page.title}</h3><p>{page.description}</p><span className="page-card-arrow"><Icon name="arrow" size={17}/></span></div>
  </Link>;
}

export function HomePage({categories,pages}:{categories:DocCategory[];pages:DocPage[]}) {
  const selected=pages.filter((page)=>page.featured).slice(0,3);
  const featured=selected.length?selected:pages.filter((page)=>page.slug!=="index").slice(0,3);
  const help=helpCategory(categories);
  return <div className="home-page">
    <section className="home-hero">
      <div className="hero-copy"><div className="hero-eyebrow"><span className="eyebrow-dot"/>Documentation Piéride</div>
        <h1>Ta vie scolaire,<br/><span>plus simple.</span></h1>
        <p>Retrouve les guides pour prendre Piéride en main, découvrir ses outils et profiter de ton quotidien scolaire.</p>
        <div className="hero-actions"><Link className="button-primary" href={categories[0]?.href||"/"}>Commencer <Icon name="arrow" size={17}/></Link>{help&&<Link className="button-secondary" href={help.href}>Besoin d’aide ?</Link>}</div>
        <div className="hero-note"><span className="hero-note-mark">✳</span>Tout ce qu’il faut savoir, réuni au même endroit.</div>
      </div>
      <div className="hero-visual"><div className="hero-glow"/><div className="hero-image-frame"><img src={sitePath("/visuels/accueil.jpg")} alt="Vue d’ensemble du tableau de bord de Piéride"/></div><div className="hero-float"><span className="float-status"/>Pensé pour ta vie scolaire</div></div>
    </section>
    <section className="content-section">
      <div className="section-heading"><div><p className="section-kicker">La documentation</p><h2>Qu’est-ce que tu cherches ?</h2></div><p>Choisis une rubrique pour trouver rapidement le bon guide.</p></div>
      <div className="category-grid">{categories.map((category,index)=>{
        const count=category.pages.filter((page)=>page.slug!=="index").length;
        return <Link key={category.slug} className="category-card" href={category.href} data-category={category.slug} style={accent(category)}>
          <span className="category-number">0{index+1}</span><span className="category-icon"><Icon name={category.icon} size={22}/></span>
          <span className="category-card-text"><strong>{category.name}</strong><small>{category.description}</small></span>
          <span className="category-count">{count} {count===1?"guide":"guides"}</span><Icon name="chevron" size={18} className="category-arrow"/>
        </Link>;
      })}</div>
    </section>
    {featured.length>0&&<section className="content-section featured-section"><div className="section-heading"><div><p className="section-kicker">À découvrir</p><h2>Les guides utiles</h2></div><span className="section-aside">Quelques repères pour démarrer</span></div><div className="page-card-grid">{featured.map((page)=>{
      const category=categories.find((item)=>item.slug===page.categorySlug);
      return category?<PageCard key={page.source} page={page} category={category}/>:null;
    })}</div></section>}
    {help&&<section className="home-cta"><div className="cta-icon"><Icon name="life" size={25}/></div><div><strong>Une question ?</strong><p>La rubrique d’aide rassemble les réponses et les premiers gestes utiles.</p></div><Link href={help.href}>Ouvrir l’aide <Icon name="arrow" size={16}/></Link></section>}
  </div>;
}

export function ArticlePage({page,category,pages}:{page:DocPage;category:DocCategory;pages:DocPage[]}) {
  const related=category.pages.filter((candidate)=>candidate.slug!==page.slug&&candidate.slug!=="index").slice(0,3);
  return <article className="article-page" data-category={category.slug} style={accent(category)}>
    <nav className="article-breadcrumbs" aria-label="Fil d’Ariane"><Link href="/">Accueil</Link><Icon name="chevron" size={14}/><Link href={category.href}>{category.name}</Link>{page.slug!=="index"&&<><Icon name="chevron" size={14}/><span>{page.title}</span></>}</nav>
    <div className="article-category"><span className="article-category-icon"><Icon name={category.icon} size={17}/></span>{category.name}</div>
    <MarkdownDocument page={page} pages={pages}/>
    <div className="article-bottom"><div className="article-updated"><span className="updated-dot"/>Guide Piéride</div><Link href={category.href}>Tous les guides de « {category.name} » <Icon name="arrow" size={16}/></Link></div>
    {related.length>0&&<section className="related-section"><div className="section-heading"><div><p className="section-kicker">Continuer</p><h2>À lire aussi</h2></div></div><div className="page-card-grid">{related.map((item)=><PageCard key={item.source} page={item} category={category}/>)}</div></section>}
  </article>;
}
