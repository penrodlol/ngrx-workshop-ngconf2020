import { createAction, props } from "@ngrx/store";
import { BookModel } from "src/app/shared/models";

export const booksLoaded = createAction(
    '[Books API] Books Loaded Success',
    props<{ books: BookModel[] }>()
);

export const updateBook = createAction(
    '[Books API] Update Book',
    props<{ updatedBook: BookModel }>()
);

export const createBook = createAction(
    '[Books API] Create Book',
    props<{ newBook: BookModel }>()
);

export const deleteBook = createAction(
    '[Books API] Delete Book',
    props<{ bookId: string }>()
);