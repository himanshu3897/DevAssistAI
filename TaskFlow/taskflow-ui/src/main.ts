import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface TaskItem { id: number; title: string; isCompleted: boolean; }

@Injectable({ providedIn: 'root' })
class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5081/api/tasks';
  list() { return this.http.get<TaskItem[]>(this.baseUrl); }
  create(title: string) { return this.http.post<TaskItem>(this.baseUrl, { title }); }
  update(task: TaskItem) {
    return this.http.put<TaskItem>(`${this.baseUrl}/${task.id}`, {
      title: task.title, isCompleted: task.isCompleted
    });
  }
  delete(id: number) { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="shell">
      <header><p class="eyebrow">PERSONAL PRODUCTIVITY</p><h1>TaskFlow</h1>
        <p class="sub">A little progress, every day.</p></header>
      <section class="panel">
        <form (ngSubmit)="addTask()">
          <input name="title" [(ngModel)]="newTitle" placeholder="What needs to get done?" maxlength="120" required>
          <button type="submit" [disabled]="busy || !newTitle.trim()">Add task</button>
        </form>
        <p class="notice" *ngIf="message">{{ message }}</p>
        <div class="summary"><span>{{ remaining }} remaining</span><span>{{ tasks.length }} total</span></div>
        <ul>
          <li *ngFor="let task of tasks">
            <label><input type="checkbox" [checked]="task.isCompleted" (change)="toggle(task)">
              <span [class.done]="task.isCompleted">{{ task.title }}</span></label>
            <button class="delete" type="button" aria-label="Delete task" (click)="remove(task.id)">×</button>
          </li>
        </ul>
        <p *ngIf="!tasks.length && !busy" class="empty">No tasks yet. Add your first one above.</p>
      </section>
      <footer>Angular · ASP.NET Core 8 · REST API</footer>
    </main>`
})
class AppComponent implements OnInit {
  private readonly service = inject(TaskService);
  tasks: TaskItem[] = [];
  newTitle = '';
  message = '';
  busy = false;
  get remaining() { return this.tasks.filter(task => !task.isCompleted).length; }
  ngOnInit() { this.load(); }
  load() {
    this.busy = true;
    this.service.list().subscribe({
      next: tasks => { this.tasks = tasks; this.busy = false; },
      error: () => { this.message = 'Could not reach API. Start TaskFlow.Api on port 5081.'; this.busy = false; }
    });
  }
  addTask() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.service.create(title).subscribe({
      next: task => { this.tasks = [...this.tasks, task]; this.newTitle = ''; this.message = ''; },
      error: () => this.message = 'Task could not be saved.'
    });
  }
  toggle(task: TaskItem) {
    this.service.update({ ...task, isCompleted: !task.isCompleted }).subscribe({
      next: updated => this.tasks = this.tasks.map(item => item.id === updated.id ? updated : item),
      error: () => this.message = 'Could not update task.'
    });
  }
  remove(id: number) {
    this.service.delete(id).subscribe({
      next: () => this.tasks = this.tasks.filter(task => task.id !== id),
      error: () => this.message = 'Could not delete task.'
    });
  }
}
bootstrapApplication(AppComponent, { providers: [provideHttpClient()] }).catch(console.error);
