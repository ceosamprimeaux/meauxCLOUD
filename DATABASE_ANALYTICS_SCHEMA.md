# MeauxOS Database Analytics Schema

## 📊 Database Overview
- **Database**: `meauxos` (D1)
- **Database ID**: `d8261777-9384-44f7-924d-c92247d55b46`
- **Total Tables**: 200+
- **Current Data**:
  - 25 Projects
  - 4 Teams
  - 15 Users
  - 0 Workers (needs population)

---

## 🎯 Key Analytics Tables

### **1. Project Management**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `projects` | Core project registry | id, org_id, team_id, name, slug, status, priority, color |
| `project_stats` | Project deployment stats | project_id, project_name, url, status, type, category, last_deployed_at |
| `project_costs` | Project cost tracking | project_id, total_time_seconds, total_time_cost, total_ai_tokens, total_ai_cost, total_cost |
| `project_cost_summary` | Aggregated cost data | - |
| `project_activity` | Activity logs | - |
| `project_members` | Team assignments | - |
| `project_progress` | Progress tracking | - |
| `project_milestones` | Milestone tracking | - |

### **2. Worker & Infrastructure**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `worker_stats` | Worker performance metrics | worker_id, worker_name, url, status, category, total_requests, last_request_at |
| `worker_logs` | Worker execution logs | - |
| `cloudflare_workers` | Worker registry | - |
| `cloudflare_usage` | Cloudflare resource usage | - |

### **3. Time Tracking**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `time_entries` | Individual time entries | id, started_at, ended_at, seconds, cost_usd, note |
| `time_logs` | Time tracking logs | - |
| `time_sessions` | Work sessions | - |
| `work_sessions` | Detailed work tracking | - |
| `work_time_sessions` | Extended session data | - |
| `user_time_tracking` | User-specific tracking | - |

### **4. AI & Token Usage**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `ai_conversations` | AI chat history | - |
| `ai_cost_tracking` | AI cost analytics | - |
| `ai_model_usage` | Model usage stats | - |
| `token_usage` | Token consumption | - |
| `openai_spending` | OpenAI costs | - |
| `openai_model_usage` | OpenAI usage breakdown | - |
| `openai_budgets` | Budget tracking | - |
| `openai_spending_alerts` | Cost alerts | - |

### **5. Workflow Analytics**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `workflow_analytics` | Workflow performance | - |
| `workflow_runs` | Workflow executions | - |
| `workflow_steps` | Step-by-step tracking | - |
| `workflow_events` | Event logging | - |
| `workflow_cost_daily` | Daily cost breakdown | - |
| `workflow_daily` | Daily metrics | - |
| `workflow_optimizations` | Optimization suggestions | - |
| `workflow_recommendations` | AI recommendations | - |

### **6. Team & User Analytics**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `teams` | Team registry | - |
| `team_members` | Team membership | - |
| `users` | User accounts | - |
| `user_sessions` | Session tracking | - |
| `user_profiles` | User metadata | - |
| `user_preferences` | User settings | - |

### **7. Cost & Financial**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `billing_usage` | Billing data | - |
| `cost_analytics` | Cost analysis | - |
| `cost_breakdown` | Detailed costs | - |
| `cost_optimization` | Cost-saving insights | - |
| `weekly_spend_reports` | Weekly summaries | - |
| `daily_spend` | Daily tracking | - |

### **8. Storage & Assets**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `r2_buckets` | R2 bucket registry | - |
| `r2_objects` | Object tracking | - |
| `r2_usage` | Storage usage | - |
| `storage_usage` | General storage metrics | - |
| `cloudflare_images` | Image analytics | - |

### **9. Email & Communications**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `email_analytics` | Email performance | - |
| `email_events` | Email event tracking | - |
| `resend_log` | Resend email logs | - |
| `resend_queue` | Email queue | - |

### **10. System Events & Logs**
| Table | Purpose | Key Fields |
|-------|---------|------------|
| `system_events` | System-wide events | - |
| `platform_events` | Platform events | - |
| `audit_log` | Audit trail | - |
| `event_log` | General event logging | - |
| `error_logs` | Error tracking | - |

---

## 🎨 Dashboard Analytics Requirements

### **Priority 1: Executive Overview**
- **Total Projects**: Count, status breakdown (active/paused/archived)
- **Total Teams**: Team count, member distribution
- **Total Users**: Active users, recent signups
- **Cost Summary**: 
  - Total spend (time + AI + infrastructure)
  - This month vs last month
  - Cost per project
  - Budget alerts

### **Priority 2: Project Analytics**
- **Project Cards**: Visual grid with:
  - Project name + color coding
  - Status indicator
  - Team assignment
  - Last deployment
  - Cost metrics
  - Progress percentage
- **Filters**: By team, status, priority, category
- **Sorting**: By cost, activity, name, date

### **Priority 3: Resource Usage**
- **Workers**: 
  - Total workers deployed
  - Request counts
  - Error rates
  - Response times
- **Storage**:
  - R2 usage by bucket
  - Image storage
  - Growth trends
- **AI Usage**:
  - Token consumption
  - Model breakdown
  - Cost per model
  - Daily/weekly trends

### **Priority 4: Time Tracking**
- **Time Entries**: 
  - Total hours logged
  - Hours by project
  - Hours by team member
  - Billable vs non-billable
- **Visualizations**:
  - Time heatmap (by day/hour)
  - Project time distribution
  - Team productivity charts

### **Priority 5: Financial Analytics**
- **Cost Breakdown Charts**:
  - Pie chart: Time vs AI vs Infrastructure
  - Line chart: Daily/weekly/monthly trends
  - Bar chart: Cost by project
- **Budget Tracking**:
  - Budget vs actual
  - Burn rate
  - Projected costs
  - Alerts for overages

### **Priority 6: Team Performance**
- **Team Metrics**:
  - Projects per team
  - Active members
  - Time logged
  - Deliverables completed
- **Member Insights**:
  - Individual contributions
  - Project assignments
  - Time allocation

---

## 🚀 Recommended Chart Types

### **For Homepage Dashboard**
1. **Hero Stats Cards** (4 cards):
   - Total Projects (with trend)
   - Active Users (with trend)
   - This Month Cost (with comparison)
   - Total Time Logged (with trend)

2. **Cost Trend Line Chart**:
   - X-axis: Last 30 days
   - Y-axis: Daily cost
   - Multiple lines: Time, AI, Infrastructure, Total

3. **Project Status Donut Chart**:
   - Active (green)
   - In Progress (blue)
   - Paused (yellow)
   - Archived (gray)

4. **Top 5 Projects Bar Chart**:
   - By cost or activity
   - Horizontal bars with color coding

5. **Team Distribution Pie Chart**:
   - Projects by team
   - Color-coded by team

### **For Analytics Page**
1. **Time Heatmap**: Calendar view of logged hours
2. **Resource Usage Gauges**: Workers, Storage, AI tokens
3. **Cost Breakdown Sunburst**: Hierarchical cost view
4. **Activity Timeline**: Recent events and deployments
5. **Predictive Analytics**: Cost forecasting

---

## 📋 Sample Queries for Dashboard

### **Get All Projects with Stats**
```sql
SELECT 
  p.id,
  p.name,
  p.slug,
  p.status,
  p.priority,
  p.color,
  t.name as team_name,
  pc.total_cost,
  pc.total_time_seconds,
  ps.last_deployed_at
FROM projects p
LEFT JOIN teams t ON p.team_id = t.id
LEFT JOIN project_costs pc ON p.id = pc.project_id
LEFT JOIN project_stats ps ON p.id = ps.project_id
ORDER BY p.updated_at DESC;
```

### **Get Cost Summary**
```sql
SELECT 
  SUM(total_cost) as total_cost,
  SUM(total_time_cost) as time_cost,
  SUM(total_ai_cost) as ai_cost,
  COUNT(DISTINCT project_id) as project_count
FROM project_costs;
```

### **Get Time Entries by Project**
```sql
SELECT 
  project_id,
  SUM(seconds) as total_seconds,
  SUM(cost_usd) as total_cost,
  COUNT(*) as entry_count
FROM time_entries
GROUP BY project_id
ORDER BY total_cost DESC;
```

---

## 🎯 Next Steps

1. **Populate Worker Stats**: Add current Cloudflare Workers to `worker_stats`
2. **Enable Real-time Tracking**: Set up Workers to log analytics on each request
3. **Create API Endpoints**: Build REST API for dashboard queries
4. **Build Chart Components**: Create reusable chart components
5. **Implement Caching**: Use KV for frequently accessed analytics
6. **Set Up Alerts**: Configure cost and usage alerts
