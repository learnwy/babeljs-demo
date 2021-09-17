function delayS(seconds: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, seconds * 1000);
	});
}

type Task = () => Promise<void>;

export class SimpleTask {
	private tasks: Task[] = [];

	constructor(private readonly limit: number = 3) {}

	addAll(actions: Task[]) {
		this.tasks.push(...actions);
	}
	add(action: Task) {
		this.tasks.push(action);
	}

	private async runInner(tasks: Task[]) {
		let runCount = 0;
		while (tasks.length) {
			if (runCount >= this.limit) {
				await delayS(200);
				continue;
			}
			if (runCount < this.limit) {
				runCount++;
				const task = tasks.pop()!;
				await task();
				runCount--;
			}
		}
	}

	async runWithoutRunningAdd(): Promise<void> {
		const oldTasks = this.tasks;
		this.tasks = [];
		await this.runInner(oldTasks);
	}

	async run(): Promise<void> {
		await this.runInner(this.tasks);
	}
}
