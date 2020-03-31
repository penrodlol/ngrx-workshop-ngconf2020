import { createReducer, on, Action, createSelector } from "@ngrx/store";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { BookModel, calculateBooksGrossEarnings } from "src/app/shared/models";
import { BooksPageActions, BooksApiActions } from "src/app/books/actions";

// const createBook = (books: BookModel[], book: BookModel) => [...books, book];
// const updateBook = (books: BookModel[], changes: BookModel) =>
//   books.map(book => {
//     return book.id === changes.id ? Object.assign({}, book, changes) : book;
//   });
// const deleteBook = (books: BookModel[], bookId: string) =>
//   books.filter(book => bookId !== book.id);


// export interface State {
//     collection: BookModel[];
//     activeBookId: string | null;
// }

// export const initialState: State = {
//     collection: [],
//     activeBookId: null
// }

export interface State extends EntityState<BookModel> {
    activeBookId: string | null;
}

export const adapter = createEntityAdapter<BookModel>({
    selectId: (model: BookModel) => model.id,
    sortComparer: (a: BookModel, b: BookModel) => a.name.localeCompare(b.name)
});

export const initialState: State = adapter.getInitialState({
    activeBookId: null
});

export const booksReducer = createReducer(
    initialState,
    on(BooksPageActions.enter, BooksPageActions.clearSelectedBook, (state) => {
        return {
            ...state,
            activeBookId: null
        }
    }),
    on(BooksPageActions.selectBook, (state, action) => {
        return {
            ...state,
            activeBookId: action.bookId
        }
    }),
    on(BooksApiActions.booksLoaded, (state, action) => {
        return adapter.addAll(action.books, state);
        // return {
        //     ...state,
        //     collection: action.books
        // }
    }),
    on(BooksApiActions.createBook, (state, actions) => {
        return adapter.addOne(actions.newBook, state);
        // return {
        //     ...state,
        //     collection: createBook(state.collection, actions.newBook)
        // }
    }),
    on(BooksApiActions.updateBook, (state, actions) => {
        return adapter.updateOne(
            { id: actions.updatedBook.id, changes: actions.updatedBook },
            {
                ...state,
                activeBookId: null
            }
        );
        // return {
        //     ...state,
        //     collection: updateBook(state.collection, actions.updatedBook)
        // }
    }),
    on(BooksApiActions.deleteBook, (state, actions) => {
        return adapter.removeOne(actions.bookId, state);
        // return {
        //     ...state,
        //     collection: deleteBook(state.collection, actions.bookId)
        // }
    })
);


// NEEDED TO MAKE AOT compiler happy; however, Angular 9 uses Ivy.
export function reducer(state: State | undefined, action: Action) {
    return booksReducer(state, action);
}

// GETTER selectors
// export const selectAll = (state: State) => state.collection;
export const { selectAll, selectEntities } = adapter.getSelectors();
export const selectActiveBookId = (state: State) => state.activeBookId;

// COMPLEX selectors
export const selectActiveBook_unoptomized = (state: State) => {
    // Inputs
    const books = selectAll(state);
    const activeBookId = selectActiveBookId(state);

    // Computation
    return books.find(book => book.id === activeBookId);
}
export const selectActiveBook = createSelector( // Max selector projector takes 8 args
    // selectAll,
    selectEntities,
    selectActiveBookId,
    // (books, activeBookId) => books.find(book => book.id === activeBookId)
    (bookEntities, activeBookId) => {
        return activeBookId ? bookEntities[activeBookId] : null;
    }
);
export const selectEarningsTotals = createSelector(
    selectAll,
    calculateBooksGrossEarnings
);
