# insights-alert-history Specification

## Purpose
TBD - created by archiving change sprint-3-inteligencia-planejamento. Update Purpose after archive.
## Requirements
### Requirement: Insights tab with alert history
The system SHALL provide an Insights tab that lists generated insights and anomaly alerts in chronological order.

#### Scenario: History displayed in Insights tab
- **WHEN** the user opens the Insights tab
- **THEN** the system shows a chronological list of generated insights and anomaly alerts

### Requirement: Alert history metadata
The system SHALL store and show alert type, category, timestamp, and summary in each history entry.

#### Scenario: History entry rendered
- **WHEN** an insight or anomaly alert is shown in history
- **THEN** the entry includes type, category, generation timestamp, and summary text

