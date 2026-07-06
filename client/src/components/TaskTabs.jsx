import { TASKS } from "../lib/constants";

// Desktop: vertical binder tabs on the side of the editor.
// Mobile (< md): collapses into a horizontal, scrollable pill row so
// the workspace below still gets full width.
export default function TaskTabs({ value, onChange }) {
	return (
		<nav
			aria-label="Task"
			className="thin-scroll flex gap-2 overflow-x-auto border-b border-border bg-panel
                 px-4 py-3 md:flex-col md:gap-1 md:overflow-visible md:border-b-0
                 md:border-r md:px-0 md:py-4">
			{TASKS.map((task) => {
				const isActive = task.id === value;
				return (
					<button
						key={task.id}
						type="button"
						aria-pressed={isActive}
						onClick={() => onChange(task.id)}
						className={[
							"group relative shrink-0 whitespace-nowrap rounded-md px-3.5 py-2 text-left text-sm",
							"font-medium transition-colors duration-150 focus-visible:outline-none",
							"md:rounded-l-md md:rounded-r-none md:py-3 md:pl-4 md:pr-3 md:mr-1",
							isActive
								? "bg-accent/15 text-accent md:z-10 md:bg-panel-alt md:shadow-tab"
								: "text-muted hover:bg-panel-alt/60 hover:text-ink hover:text-ink md:hover:bg-transparent",
						].join(" ")}>
						{isActive && (
							<span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent md:inset-x-auto md:inset-y-0 md:left-0 md:bottom-auto md:h-full md:w-0.5" />
						)}
						{task.label}
					</button>
				);
			})}
		</nav>
	);
}
