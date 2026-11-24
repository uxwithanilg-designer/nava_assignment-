import type { Person } from '@/types/domain';

/** The only people in the design. Do not add others. */
export const people: Record<Person['id'], Person> = {
  ryan: {
    id: 'ryan',
    name: 'Ryan M',
    initials: 'RM',
    role: 'Facility manager',
    scope: 'Unit 3',
    openCount: 2,
    isCurrentUser: true,
  },
  emily: { id: 'emily', name: 'Emily C', initials: 'EC', role: 'QA reviewer', scope: 'Unit 3', openCount: 3 },
  sarah: {
    id: 'sarah',
    name: 'Dr Sarah J',
    initials: 'SJ',
    role: 'Biosecurity lead',
    scope: 'Group',
    openCount: 1,
  },
  david: { id: 'david', name: 'David B', initials: 'DB', role: 'Group operations', scope: 'Group', openCount: 0 },
};

/** Signed-in user (avatar "RM" in the top bar). */
export const currentUser = people.ryan;
