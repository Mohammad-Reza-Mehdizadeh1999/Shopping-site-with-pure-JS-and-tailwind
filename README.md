# 🛍️ Morez Shop

A simple shopping site project built with **JSON Server** as the backend
and **Vite** for the frontend.\
This project includes product categories, gender-based filtering, and
shopping cart management.

------------------------------------------------------------------------

## ⚙️ Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/)

------------------------------------------------------------------------

## 🚀 Getting Started

### 1. Clone the repository

``` bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Run the backend (JSON Server)

Start the backend on port `3000`:

``` bash
npm run server
```

The server reads data from the `db.json` file.\
Example endpoints: - <http://localhost:3000/categories> -
<http://localhost:3000/cart> - <http://localhost:3000/coat-shomiz>

### 4. Run the frontend (Vite)

Start the frontend on port `5173` (Vite default):

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🛒 Features

-   Display product categories
-   Filter products by gender
-   Add products to the cart
-   Manage item quantity in the cart
-   Calculate the final total

------------------------------------------------------------------------

## 📜 Useful Commands

-   Run JSON Server:

    ``` bash
    npm run server
    ```

-   Run frontend development server:

    ``` bash
    npm run dev
    ```

