document.addEventListener('DOMContentLoaded', function () {
    const inputBookTitle = document.getElementById('inputBookTitle');
    const inputBookAuthor = document.getElementById('inputBookAuthor');
    const inputBookYear = document.getElementById('inputBookYear');
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    const bookSubmit = document.getElementById('bookSubmit');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const searchBookTitle = document.getElementById('searchBookTitle');
    const searchSubmit = document.getElementById('searchSubmit');

    bookSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        addBook();
    });

    searchSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        searchBooks(searchBookTitle.value);
    });

    function createBook(title, author, year, isComplete) {
        const book = document.createElement('article');
        book.classList.add('book_item');

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = title;

        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = 'Penulis: ' + author;

        const bookYear = document.createElement('p');
        bookYear.innerText = 'Tahun: ' + year;

        const action = document.createElement('div');
        action.classList.add('action');

        const finishButton = document.createElement('button');
        if (isComplete) {
            finishButton.innerText = 'selesai dibaca';
            finishButton.classList.add('green');
        } else {
            finishButton.innerText = 'Belum Selesai dibaca';
            finishButton.classList.add('green');
        }
        finishButton.addEventListener('click', function () {
            moveBookToAnotherShelf(book, isComplete);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.classList.add('red');
        deleteButton.addEventListener('click', function () {
            removeBook(book);
        });

        action.appendChild(finishButton);
        action.appendChild(deleteButton);

        book.appendChild(bookTitle);
        book.appendChild(bookAuthor);
        book.appendChild(bookYear);
        book.appendChild(action);

        return book;
    }


    function addBook() {
        const title = inputBookTitle.value;
        const author = inputBookAuthor.value;
        const year = inputBookYear.value;
        const isComplete = inputBookIsComplete.checked;

        if (title === '' || author === '' || year === '') {
            alert('Harap isi semua dengan benar. masa iya isinya gk ada kaya dompet :) ');
            return;
        }

        const book = createBook(title, author, year, isComplete);

        if (isComplete) {
            completeBookshelfList.appendChild(book);
        } else {
            incompleteBookshelfList.appendChild(book);
        }

        updateDataToStorage();
    }

    function moveBookToAnotherShelf(book, isComplete) {
        const shelfDestination = isComplete ? completeBookshelfList : incompleteBookshelfList;

        const bookTitle = book.querySelector('h3').innerText;
        const bookAuthor = book.querySelector('p').innerText.substring(9);
        const bookYear = book.querySelector('p:nth-child(3)').innerText.substring(7);
        const newBook = createBook(bookTitle, bookAuthor, bookYear, !isComplete);

        shelfDestination.appendChild(newBook);
        removeBook(book);

        updateDataToStorage();
    }

    function removeBook(book) {
        book.parentElement.removeChild(book);

        updateDataToStorage();
    }

    function updateDataToStorage() {
        const incompleteBookshelf = document.querySelectorAll('.book_item:not(.green)');
        const completeBookshelf = document.querySelectorAll('.book_item.green');

        const books = {
            incomplete: [],
            complete: [],
        };

        incompleteBookshelf.forEach((book) => {
            const title = book.querySelector('h3').innerText;
            const author = book.querySelector('p').innerText.substring(9);
            const year = book.querySelector('p:nth-child(3)').innerText.substring(7);
            books.incomplete.push({ title, author, year, isComplete: false });
        });

        completeBookshelf.forEach((book) => {
            const title = book.querySelector('h3').innerText;
            const author = book.querySelector('p').innerText.substring(9);
            const year = book.querySelector('p:nth-child(3)').innerText.substring(7);
            books.complete.push({ title, author, year, isComplete: true });
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    function searchBooks(keyword) {
        const allBooks = document.querySelectorAll('.book_item h3');
        allBooks.forEach((book) => {
            const title = book.innerText.toLowerCase();
            if (title.includes(keyword.toLowerCase())) {
                book.parentElement.style.display = 'block';
            } else {
                book.parentElement.style.display = 'none';
            }
        });
    }

    function loadStorageData() {
        const data = JSON.parse(localStorage.getItem('books'));
        if (data) {
            data.incomplete.forEach((book) => {
                const newBook = createBook(book.title, book.author, book.year, false);
                incompleteBookshelfList.appendChild(newBook);
            });

            data.complete.forEach((book) => {
                const newBook = createBook(book.title, book.author, book.year, true);
                completeBookshelfList.appendChild(newBook);
            });
        }
    }

    loadStorageData();
});