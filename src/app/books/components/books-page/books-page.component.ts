import { Component, OnInit } from "@angular/core";
import {
  BookModel,
  BookRequiredProps
} from "src/app/shared/models";
import { Store } from '@ngrx/store';
import { State, selectBookEarningsTotals, selectAllBooks, selectActiveBook } from 'src/app/shared/state';
import { BooksPageActions } from 'src/app/books/actions';
import { Observable } from 'rxjs';

@Component({
  selector: "app-books",
  templateUrl: "./books-page.component.html",
  styleUrls: ["./books-page.component.css"]
})
export class BooksPageComponent implements OnInit {
  books$: Observable<BookModel[]> = this.store.select(selectAllBooks);
  currentBook$: Observable<BookModel | null | undefined> = this.store.select(selectActiveBook);
  total$: Observable<number> = this.store.select(selectBookEarningsTotals);

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch(BooksPageActions.enter());
    this.removeSelectedBook();
  }

  onSelect(book: BookModel) {
    this.store.dispatch(BooksPageActions.selectBook({ bookId: book.id }))
  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    this.store.dispatch(BooksPageActions.clearSelectedBook());
  }

  onSave(book: BookRequiredProps | BookModel) {
    if ("id" in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    this.store.dispatch(BooksPageActions.createBook({ newBook: bookProps }));
  }

  updateBook(book: BookModel) {
    this.store.dispatch(BooksPageActions.updateBook({ updatedBook: book, bookId: book.id }));
  }

  onDelete(book: BookModel) {
    this.store.dispatch(BooksPageActions.deleteBook({ bookId: book.id }));
  }
}
