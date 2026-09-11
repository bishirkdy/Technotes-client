import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NoteApiService } from '../../services/note-api.service';
@Component({
  selector: 'app-note-view',
  imports: [RouterLink],
  templateUrl: './note-view.html',
  styleUrl: './note-view.css',
})
export class NoteView {
  private readonly route = inject(ActivatedRoute);
  private readonly noteApi = inject(NoteApiService);

  note: any = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Note ID is missing.';
      this.loading = false;
      return;
    }

    this.noteApi.getById(id).subscribe({
        next : (result) => {
            this.note = result,
            this.loading = false
        },
        error : (err) => {
            console.log(err)

            this.error = "Unable to load note"
            this.loading = false;
        }
    })
  }
}
