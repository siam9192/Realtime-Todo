import taskService from '../modules/task/task.service';
import userRepository from '../modules/user/user.repository';
import taskRepository from '../modules/task/task.repository';
import testData from './test.data';


type AssignmentChange = {
  unassignedUserIds: string[];
  assignedUserIds: string[];
  updateRecipients: string[];
};

export function resolveTaskUpdateEffects({
  data,
  assigned,
}: {
  data: {
    id: string;
    creatorId: string;
    assignedToId?: string | null;
  };
  assigned?: {
    from?: string;
    to?: string;
  } | null;
}): AssignmentChange {
  const unassignedUserIds: string[] = [];
  const assignedUserIds: string[] = [];
  const updateRecipients = new Set<string>();

  // creator always gets update
  updateRecipients.add(data.creatorId);

  if (assigned?.from) {
    unassignedUserIds.push(assigned.from);
  }

  if (assigned?.to) {
    assignedUserIds.push(assigned.to);
  }

  // assignment unchanged
  if (!assigned && data.assignedToId) {
    updateRecipients.add(data.assignedToId);
  }

  return {
    unassignedUserIds,
    assignedUserIds,
    updateRecipients: [...updateRecipients],
  };
}


   const {createTaskPayload,createdTask,updatedTask,authUser} = testData

describe('Task Service – createTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    jest.spyOn(userRepository, 'isExistById').mockResolvedValue(true);
    jest.spyOn(taskRepository, 'create').mockResolvedValue(createdTask);

    const result = await taskService.createTask(authUser, createTaskPayload);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('data.id');
  });
});


describe('Task Service – updateTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a task successfully and return assigned changes', async () => {
    jest.spyOn(userRepository, 'isExistById').mockResolvedValue(true);
    jest.spyOn(taskRepository, 'findById').mockResolvedValue(createdTask);
    jest.spyOn(taskRepository, 'updateById').mockResolvedValue(updatedTask);

    const result = await taskService.updateTask(
      authUser,
      createdTask.id,
      {
        title: updatedTask.title,
        assignedToId: updatedTask.assignedToId,
      },
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('data.id');
    expect(result).toHaveProperty('assigned.from');
    expect(result).toHaveProperty('assigned.to');
  });
});


describe('resolveTaskUpdateEffects – logic only', () => {
  it('returns correct users when assignment changes', () => {
    const result = resolveTaskUpdateEffects({
      data: {
        id: 'task-1',
        creatorId: 'user-1',
        assignedToId: 'user-3',
      },
      assigned: {
        from: 'user-2',
        to: 'user-3',
      },
    });

    expect(result.unassignedUserIds).toEqual(['user-2']);
    expect(result.assignedUserIds).toEqual(['user-3']);
    expect(result.updateRecipients).toEqual(['user-1']);
  });

  it('includes creator and assignee when assignment unchanged', () => {
    const result = resolveTaskUpdateEffects({
      data: {
        id: 'task-2',
        creatorId: 'user-1',
        assignedToId: 'user-2',
      },
      assigned: null,
    });

    expect(result.unassignedUserIds).toEqual([]);
    expect(result.assignedUserIds).toEqual([]);
    expect(result.updateRecipients.sort()).toEqual(['user-1', 'user-2']);
  });

  it('does not duplicate users when creator === assignee', () => {
    const result = resolveTaskUpdateEffects({
      data: {
        id: 'task-3',
        creatorId: 'user-1',
        assignedToId: 'user-1',
      },
      assigned: null,
    });

    expect(result.updateRecipients).toEqual(['user-1']);
  });

  it('handles only unassignment correctly', () => {
    const result = resolveTaskUpdateEffects({
      data: {
        id: 'task-4',
        creatorId: 'user-1',
      },
      assigned: {
        from: 'user-2',
      },
    });

    expect(result.unassignedUserIds).toEqual(['user-2']);
    expect(result.assignedUserIds).toEqual([]);
    expect(result.updateRecipients).toEqual(['user-1']);
  });
});
