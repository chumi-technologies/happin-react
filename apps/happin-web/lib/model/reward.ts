export interface RewardListResponse {
  data:{
    balance: Balance;
    dailyCheckIn: DailyCheckIn;
    tasks: Tasks;
  }
}

export interface Balance {
    diamonds: number;
    coins: number;
}

export interface DailyCheckIn {
    strike: number;
    reward: number;
    rewardType: string;
}

export interface Tasks {
    weekly: TaskDetail[];
    semiMonthly: TaskDetail[];
    "one-time": TaskDetail[];
}

export interface TaskDetail {
    claimable: boolean;
    claimed: boolean;
    description: string;
    lastClaimedOn: any;
    rewardAmount: number;
    rewardType: string;
    type: string;
    _id: string;
    buttonText: string;
}



