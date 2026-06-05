import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const agentSchedules = [
    { name: 'taco-nudge',     schedule: 'rate(15 minutes)' },
    { name: 'good-vibes',     schedule: 'rate(15 minutes)' },
    { name: 'mini-me',        schedule: 'rate(5 minutes)'  },
    { name: 'church-lady',    schedule: 'rate(15 minutes)' },
    { name: 'welcome-wagon',  schedule: 'rate(15 minutes)' },
    { name: 'matchmaker',     schedule: 'cron(0 8 * * ? *)' },
    { name: 'elephant',       schedule: 'cron(0 2 * * ? *)' },
];

// `enabled` defaults to false: the rules are created in a DISABLED state so the
// agents never fire automatically on deploy. Validate each agent by invoking the
// Lambda manually first, then flip to enabled (pass { enabled: true } or toggle
// the rules in the EventBridge console) as a deliberate go-live step.
export const createAgentSchedules = (scope, agentsLambda, { enabled = false } = {}) => {
    agentSchedules.forEach(({ name, schedule }) => {
        const rule = new events.Rule(scope, `agent-schedule-${name}`, {
            ruleName: `v1x-agent-${name}`,
            schedule: events.Schedule.expression(schedule),
            enabled,
        });

        rule.addTarget(new targets.LambdaFunction(agentsLambda, {
            event: events.RuleTargetInput.fromObject({ agent: name }),
        }));
    });
};
