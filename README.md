# To do
- Calendar.jsx: Create this module. Include a weekly view (days on top, time on the left in 15m intervals) that show the class blocks but also allows the user to enter in events (these events could have reminders to send email or text reminders and also send notifications to the user on the app)
- AccountSettings.jsx: Create this page to allow the user to update display name and color settings!
- Planner.jsx: Create a feature for overdue unchecked tasks to create a notification in app. The user can clear out the task manually, check it off, or edit the task which will remove the overdue message.
- Add a feature to print the planner.
- PlannerSettings.jsx: Styles and Responsiveness
- Week.jsx: Mobile Responsiveness.


- FIX: Start and End Times - Single digits should have a 0 as the first digit. If user doesn't select AM or FM it should default to AM, not undefined.
- FIX: Class Days - Update to just show single letter (MTWRF) and keep it in order.
- FIX: Planner not found message when loading a new page (between Week, PlannerCalendar, and PlannerSettings)