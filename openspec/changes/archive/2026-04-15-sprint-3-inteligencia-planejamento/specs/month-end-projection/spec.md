## ADDED Requirements

### Requirement: Month-end projection summary
The system SHALL calculate and display projected month-end income, projected month-end expense, and projected month-end balance based on current month transactions.

#### Scenario: Projection shown with current month data
- **WHEN** the user opens the dashboard with at least one transaction in the current month
- **THEN** the system shows projected income, projected expense, and projected balance for month end

### Requirement: Projection transparency
The system SHALL expose the basis used for the projection so users can understand how the estimate was produced.

#### Scenario: Projection basis available
- **WHEN** the projection values are rendered
- **THEN** the system also shows the observed period and daily average used in the estimate
