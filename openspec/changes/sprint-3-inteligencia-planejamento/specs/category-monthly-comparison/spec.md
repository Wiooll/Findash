## ADDED Requirements

### Requirement: Category month-over-month comparison
The system SHALL compare current month expense totals against previous month expense totals for each category.

#### Scenario: Comparison table loaded
- **WHEN** the user accesses the monthly comparison view
- **THEN** the system lists each category with current month total and previous month total

### Requirement: Category variance metrics
The system SHALL provide absolute and percentage variance for each compared category.

#### Scenario: Variance calculated for category
- **WHEN** both current and previous month totals exist for a category
- **THEN** the system displays absolute difference and percentage change for that category
