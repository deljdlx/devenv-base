export default async function ({ page }) {
  // 1. Récupérer le contenu de l'API React
  await page.goto('https://reactjs.org/docs/react-api.html', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const apiContent = await page.evaluate(() => {
    const article = document.querySelector('article');
    return article ? article.innerHTML : '<p>No content found</p>';
  });

  // 2. Récupérer la feuille de style markdown
  await page.goto('https://raw.githubusercontent.com/simonlc/Markdown-CSS/master/markdown.css', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const stylesheet = await page.evaluate(() => document.body.innerText);

  // 3. Injecter contenu + CSS dans une page vierge
  await page.goto('about:blank');
  await page.setContent(apiContent);
  await page.addStyleTag({ content: stylesheet });

  // 4. Générer un PDF et le retourner
  const pdf = await page.pdf({
    printBackground: true,
    format: 'A4',
  });

  // Variante 1 : retourner directement le buffer (supportée par /function) 
  return pdf;

  // Variante 2 (plus explicite) :
  // return {
  //   data: pdf,
  //   type: 'application/pdf',
  // };
}
