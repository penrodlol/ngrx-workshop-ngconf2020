import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { mergeMap, map, exhaustMap, concatMap } from 'rxjs/operators';
import { BooksService } from "../shared/services";
import { BooksPageActions, BooksApiActions } from "./actions";

@Injectable()
export class BooksApiEffects {
    constructor(private actions$: Actions, private bookService: BooksService) { }

    getAllBooks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.enter),
            exhaustMap(() => { // Non-parameterized query
                return this.bookService
                    .all()
                    .pipe(map(books => BooksApiActions.booksLoaded({ books }))
                )
            })
        )
    });

    createBook$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.createBook),
            concatMap(action => { // Updating or creating entries
                return this.bookService
                    .create(action.newBook)
                    .pipe(map(book => BooksApiActions.createBook({ newBook: book })))
            })
        )
    });

    updateBook$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.updateBook),
            concatMap(action => { // Updating or creating entries
                return this.bookService
                    .update(action.bookId, action.updatedBook)
                    .pipe(map(book => BooksApiActions.updateBook({ updatedBook: book })))
            })
        )
    });

    deleteBooks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(BooksPageActions.deleteBook),
            mergeMap(action => { // Dont care about order
                return this.bookService
                    .delete(action.bookId)
                    .pipe(map(() => BooksApiActions.deleteBook({ bookId: action.bookId })))
            })
        )
    });
}
