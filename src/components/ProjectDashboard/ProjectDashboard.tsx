import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchProjectDashboardData } from "@/services";
import type {
  Project,
  ProjectTable,
  Operation,
  Governance,
  LineageRelation,
} from "@/types";
import { Skeleton } from "@/components/Skeleton";
import { Panel } from "@/components/Panel";
import { ProjectHeader } from "./ProjectHeader";
import styles from "./ProjectDashboard.module.scss";

interface DashboardData {
  project: Project;
  tables: ProjectTable[];
  operations: Operation[];
  governance: Governance | null;
  lineage: LineageRelation[];
}

export function ProjectDashboard(): ReactNode {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);
        const result = await fetchProjectDashboardData(projectId);
        
        if (!result.project) {
          setError("Project not found");
          return;
        }
        
        setData({
          project: result.project,
          tables: result.tables,
          operations: result.operations,
          governance: result.governance,
          lineage: result.lineage,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [projectId]);

  const handleBack = () => {
    navigate("/");
  };

  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page} data-testid="project-dashboard">
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft size={16} />
        <span>Back to Projects</span>
      </button>

      {loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <ProjectHeader project={data.project} />

          <div className={styles.grid}>
            <Panel title="Data Tables" data-testid="data-tables-panel">
              <p className={styles.placeholder}>
                {data.tables.length} tables • Coming in Phase 5
              </p>
            </Panel>

            <Panel title="Recent Operations" data-testid="operations-timeline">
              <p className={styles.placeholder}>
                {data.operations.length} operations • Coming in Phase 6
              </p>
            </Panel>

            <Panel title="Governance" data-testid="governance-panel">
              <p className={styles.placeholder}>
                {data.governance?.approvals.length ?? 0} approvals • Coming in Phase 7
              </p>
            </Panel>

            <Panel title="Data Lineage" data-testid="lineage-view">
              <p className={styles.placeholder}>
                {data.lineage.length} relations • Coming in Phase 8
              </p>
            </Panel>
          </div>
        </>
      )}
    </main>
  );
}

function DashboardSkeleton(): ReactNode {
  return (
    <>
      {/* Header skeleton */}
      <div className={styles.headerSkeleton}>
        <Skeleton width="50%" height="2rem" />
        <Skeleton width="30%" height="1rem" />
      </div>

      {/* Grid skeleton */}
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.panelSkeleton}>
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="100%" height="6rem" />
          </div>
        ))}
      </div>
    </>
  );
}

