# automated-spending-insights Specification

## Purpose
TBD - created by archiving change sprint-3-inteligencia-planejamento. Update Purpose after archive.
## Requirements
### Requirement: Automatic increase and decrease insights
The system SHALL generate automatic insights for relevant increase or decrease in category spending between current and previous month.

#### Scenario: Increase insight generated
- **WHEN** a category exceeds the configured increase threshold
- **THEN** the system creates an insight indicating spending growth for that category

#### Scenario: Decrease insight generated
- **WHEN** a category exceeds the configured decrease threshold
- **THEN** the system creates an insight indicating spending reduction for that category

### Requirement: Insight message clarity
The system SHALL include category name and variance values in each generated insight message.

#### Scenario: Insight message rendered
- **WHEN** an automatic insight is displayed
- **THEN** the user can see which category changed and by how much in value and percentage

