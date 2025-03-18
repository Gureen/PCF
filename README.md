# Process Flow Configurator Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Installation Guide](#installation-guide)
3. [User Guide](#user-guide)
   - [Getting Started](#getting-started)
   - [Creating a New Process Flow](#creating-a-new-process-flow)
   - [Working with Activities](#working-with-activities)
   - [Connecting Activities](#connecting-activities)
   - [Activity Configuration](#activity-configuration)
   - [Validation and Error Handling](#validation-and-error-handling)
   - [Saving and Loading Flows](#saving-and-loading-flows)
   - [Exporting and Importing Flows](#exporting-and-importing-flows)
   
## Introduction

The Process Flow Configurator is a web-based application designed to help users define and configure custom process flows for specific applications or business processes. It provides an intuitive visual interface where users can drag and drop activities, connect them with flows, and configure properties for each activity.

This powerful tool enables businesses to:
- Design and visualize complex workflows
- Define activity relationships and dependencies
- Configure detailed properties for activities and transitions
- Validate process flows for completeness and correctness
- Export flows for integration with other systems

## Installation Guide

### System Requirements
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 16.x or higher
- npm 8.x or higher

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gureen/PCF.git
   cd process-flow-configurator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:5173`

## User Guide

### Getting Started

When you first open the Process Flow Configurator, you'll see a split-screen interface:
- The left panel contains the form for defining activities and process flow details
- The right panel shows the visual canvas for manipulating the flow and a list of activity templates


### Creating a New Process Flow

1. Click the "New" button in the top action bar
2. If you have unsaved changes in the current flow, you'll be prompted to confirm
3. Enter a name for your process flow in the "Project Flow Name" field
4. Optionally add a description

### Working with Activities

#### Adding Activities

There are two ways to add activities to your flow:

1. **Using Templates**:
   - Browse the available templates in the "Activity Templates" section
   - Drag a template from the list and drop it onto the canvas
   - The template will be added as a new activity with default properties

2. **Creating Custom Activities**:
   - Fill in the activity details in the form on the left panel
   - Click "Add Activity" to create the activity
   - The new activity will appear on the canvas

#### Selecting and Editing Activities

- Click on an activity node to select it
- Double-click an activity to edit its properties
- When an activity is selected, the edit and delete buttons in the top-right corner of the canvas become active

#### Deleting Activities

- Select an activity by clicking on it
- Click the "Delete" button in the top-right corner of the canvas
- Alternatively, select an activity and press the Delete key

### Connecting Activities

To establish the flow between activities:

1. Hover over an activity node to see connection points
2. Click and drag from an output connection point to create a connection
3. Drag the line to the input connection point of another activity
4. Release to create the connection

Notes on connections:
- Each activity can have up to 3 incoming connections (inputs)
- Each activity can have up to 3 outgoing connections (outputs)
- The system prevents circular dependencies
- Connections are represented by animated arrows

### Activity Configuration

Each activity has several configurable properties:

1. **Basic Information**:
   - Activity Name: A unique, descriptive name
   - Description: Detailed information about the activity's purpose
   - Color: Visual identifier on the canvas (select from a color picker)

2. **Assignment and Deadlines**:
   - Assigned Users: Team members responsible for the activity
   - Deadline: Target completion date

3. **Approval Criteria**:
   - Define conditions that must be met to complete the activity

When editing an existing activity:
1. Select the activity on the canvas
2. Click the "Edit" button in the top-right corner
3. Modify the properties in the form
4. Click "Update" to save changes

### Validation and Error Handling

The Process Flow Configurator performs several validation checks:

1. **Circular Dependency Detection**:
   - The system prevents connections that would create loops in the flow
   - If attempted, an error message will appear

2. **Connection Limits**:
   - Error messages appear if you exceed the input/output limits for activities

3. **Flow Validation on Save**:
   - Process name validation
   - Minimum of two activities required
   - At least one connection between activities required

If validation fails, informative error messages will guide you on how to fix the issues.

### Saving and Loading Flows

#### Saving a Flow

1. Ensure your flow has a name in the "Project Flow Name" field
2. Click the "Save" button in the action bar
3. If successful, a confirmation message will appear
4. For existing flows, clicking "Save" will update the flow

#### Loading a Flow

1. Locate the flow in the "Process Flow" table at the bottom of the left panel
2. Click the "Load" button for the desired flow
3. If you have unsaved changes, a confirmation dialog will appear
4. Once loaded, the flow will appear on the canvas and the form will be populated with the current activity data

### Exporting and Importing Flows

#### Exporting a Flow

1. Find the flow in the "Process Flow" table
2. Click the "Export" button for the desired flow
3. The flow will be downloaded as a JSON file named after the flow

#### Importing a Flow

1. Click the "Import" button in the "Process Flow" table
2. Select a JSON file containing a valid flow configuration
3. If valid, a confirmation dialog will appear showing the flow details
4. Click "Confirm" to import the flow
5. The imported flow will be added to your saved flows