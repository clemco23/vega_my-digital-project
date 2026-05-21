import { legalPagesByPath } from "./data/legalPages";
import LandingPage from "./pages/LandingPage";
import StaticInfoPage from "./pages/StaticInfoPage";

function normalizePath(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, "");
  return normalizedPath || "/";
}

function App() {
  const pathname = normalizePath(window.location.pathname);

  if (pathname === "/") {
    return <LandingPage />;
  }

  const currentLegalPage = legalPagesByPath[pathname];

  if (currentLegalPage) {
    return (
      <StaticInfoPage
        title={currentLegalPage.title}
        summary={currentLegalPage.summary}
        sections={currentLegalPage.sections}
      />
    );
  }

  return (
    <StaticInfoPage
      title="Page introuvable"
      summary="La page demandee n'existe pas ou n'est plus disponible."
      statusCode="404"
    />
  );
}

export default App;
