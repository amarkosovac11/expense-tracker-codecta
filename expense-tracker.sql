-- Category table
CREATE TABLE "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL
);

-- Initial data
INSERT INTO "Category" (name, type) VALUES
('Food', 'expense'),
('Rent', 'expense'),
('Fuel', 'expense'),
('Salary', 'income');


-- Expense table
CREATE TABLE "Expense" (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    CONSTRAINT fk_expense_category FOREIGN KEY (category_id)
        REFERENCES "Category"(id)
);

-- Initial data
INSERT INTO "Expense" (category_id, amount, date, description) VALUES
(1, 25.50, '2025-01-20', 'Groceries'),
(2, 400.00, '2025-01-05', 'Monthly rent'),
(3, 50.00,  '2025-01-10', 'Gas refill');



-- SavingGoal table
CREATE TABLE "SavingGoal" (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC NOT NULL,
    deadline DATE
);

-- Saving goals data
INSERT INTO "SavingGoal" (title, target_amount, current_amount, deadline) VALUES
('New Laptop', 2000, 300, '2025-12-31'),
('Vacation Trip', 1500, 100, '2025-08-15');



-- SavingTransaction Table

CREATE TABLE "SavingTransaction" (
    id SERIAL PRIMARY KEY,
    saving_goal_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_saving_goal FOREIGN KEY (saving_goal_id)
        REFERENCES "SavingGoal"(id)
);

-- Transactions data
INSERT INTO "SavingTransaction" (saving_goal_id, amount, date) VALUES
(1, 150, '2025-01-20'),
(1, 50,  '2025-01-25'),
(2, 100, '2025-01-18');
