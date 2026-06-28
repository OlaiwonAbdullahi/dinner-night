# TODO (Department + Award updates)

## Department (Cyber Security / Computer Science)
- [ ] Add `department` field to `prisma/schema.prisma` (model `Ticket`).
- [ ] Update `components/checkout-form.tsx` to collect department.
- [ ] Update `components/ticket-checkout-button.tsx` and `components/sponsor-checkout-button.tsx` to pass `department` into `/api/tickets`.
- [ ] Update `app/tickets/receipt/[reference]/page.tsx` to display department.
- [ ] Create new admin page `app/admin/department-tickets/page.tsx` showing department rows for all ticket statuses.
- [ ] Add link to that admin page in `components/admin-sidebar.tsx`.

## Award rename
- [ ] Update `lib/data.ts` category name for `cruise-commander` to `Most Vibrant Personality Award of the Year`.
- [ ] Find admin pages that render category names and ensure the change shows there too.

