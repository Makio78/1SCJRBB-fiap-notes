import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Note } from 'src/app/services/@types/note';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrls: ['./list-notes.component.css'],
})
export class ListNotesComponent implements OnInit {
  title = 'Titulo da nota';
  notes = [] as Note[];

  subscription: Subscription;

  //injetando a dependência do service
  constructor(private noteService: NoteService) {
    this.subscription = this.noteService.newNoteProvider.
        subscribe((note: Note) => {
          this.getApiNotes();
          //this.notes.push(note);
        });
        error: () => {}
  }

  // método do ciclo de vida do componente
  ngOnInit(): void {
    this.getApiNotes();
  }

  getApiNotes(){
    this.noteService.getNotes().subscribe({
      next: (apiNotes) => this.notes = apiNotes,
      error: (error) => console.error(error),
    });
  }

  removeNote(noteId: number){
    this.noteService.removeNote(noteId).subscribe(
      () => this.getApiNotes()
    );
  }

  editNote(note: Note){
    this.noteService.notifyEditNote(note);
   }


}
