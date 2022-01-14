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
    hasCheckedIn: boolean;
}

export interface Tasks {
    weekly: TaskDetail[];
    semiMonthly: TaskDetail[];
    oneTime: TaskDetail[];
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

export interface Transaction {
  amount: number;
  content: string;
  currency: string;
  timestamp: any;
  title: string;
  icon: string;
}



