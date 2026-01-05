import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";
import type { Env } from "../types/env";
import { GoogleService } from "../services/google";

type BrandParams = {
    projectName: string;
    description: string;
    userId: string;
};

export class BrandBuilderWorkflow extends WorkflowEntrypoint<Env, BrandParams> {
    async run(event: WorkflowEvent<BrandParams>, step: WorkflowStep) {
        const { projectName, description, userId } = event.payload;

        // Step 1: AI Brand Strategy (Mission, Vision, Values)
        const strategy = await step.do("generate-strategy", async () => {
            const google = new GoogleService(this.env, userId);
            const prompt = `Act as a world-class brand strategist. For a project named "${projectName}" described as: "${description}", generate a JSON object with: 
             1. mission_statement
             2. vision_statement
             3. tagline (punchy, modern)
             4. core_values (array of 3)`;

            // We use our existing service which handles auth/refresh
            const result = await google.generateContent(prompt);
            const text = result.candidates[0].content.parts[0].text;

            // Cleanup markdown code blocks if present
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '');
            return JSON.parse(cleanJson);
        });

        // Step 2: AI Visual Identity (Colors, Typography)
        const visuals = await step.do("generate-visuals", async () => {
            const google = new GoogleService(this.env, userId);
            const prompt = `Based on the mission "${strategy.mission_statement}", recommmend a visual identity. Return JSON with:
             1. primary_color (hex)
             2. secondary_color (hex)
             3. accent_color (hex)
             4. font_pairing (serif/sans-serif recommendation)
             5. mood_keywords (array)`;

            const result = await google.generateContent(prompt);
            const text = result.candidates[0].content.parts[0].text;
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '');
            return JSON.parse(cleanJson);
        });

        // Step 3: Save to Database (Commit the Brand)
        await step.do("save-to-db", async () => {
            // Create project entry with this data
            // Assuming 'projects' table has a 'settings' or 'brand_data' JSON column
            // If not, we'll stuff it in description or just log it for now

            const brandData = {
                strategy,
                visuals,
                generatedAt: new Date().toISOString()
            };

            await this.env.DB.prepare(
                `INSERT INTO projects (name, description, owner_id, status, created_at) VALUES (?, ?, ?, 'planning', ?)`
            ).bind(
                projectName,
                JSON.stringify(brandData), // Storing full brand bundle in description for now as a hack/demo
                userId,
                Date.now()
            ).run();
        });

        return {
            status: "complete",
            project: projectName,
            strategy,
            visuals
        };
    }
}
