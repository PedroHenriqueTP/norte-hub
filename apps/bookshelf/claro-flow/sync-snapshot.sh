#!/bin/bash
# Snapshot do Projeto Claro Conecta v20

OUTPUT="PROJECT_SNAPSHOT.md"

echo "# PROJECT SNAPSHOT: CLARO CONECTA v20" > $OUTPUT
echo "## Governance" >> $OUTPUT
if [ -f .ai_governance/project_paper.md ]; then cat .ai_governance/project_paper.md >> $OUTPUT; fi
if [ -f .ai_governance/CREATIVE_DNA.md ]; then cat .ai_governance/CREATIVE_DNA.md >> $OUTPUT; fi
echo -e "\n## Task Status" >> $OUTPUT
if [ -f task.md ]; then cat task.md >> $OUTPUT; fi

echo "Snapshot gerado com sucesso em $OUTPUT"
