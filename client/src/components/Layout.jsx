import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainWrapper}>
        <Header />
        <main style={styles.mainContent}>
          <div style={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--bg-body)",
  },
  mainWrapper: {
    flex: 1,
    marginLeft: "280px", // Match new sidebar width
    display: "flex",
    flexDirection: "column",
    minWidth: 0, // Prevent flex overflow
  },
  mainContent: {
    marginTop: "70px", // Match header height
    padding: "var(--space-8) var(--space-4)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  }
};

export default Layout;
