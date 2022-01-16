import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { INode } from "@wise/common";
import React, { useState } from "react";
export function PinCard({ node, onClick }: { node: INode; onClick?: any }) {
  return (
    <div>
      <div className="fade">
        <div>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {node.props.name}
            </Typography>
            <Typography
              variant="body2"
              style={{ maxHeight: "20rem" }}
              className="overflow-x-auto"
            >
              {node.props.content}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={onClick}>
              Complete
            </Button>
            <Button
              size="small"
              onClick={onClick}
              color="error"
              className="ml-2"
            >
              Remove
            </Button>
          </CardActions>
        </div>
      </div>
    </div>
  );
}
export function Pin() {
  const [n, setN] = useState([0]);
  return (
    <div className="w-full h-full p-4" style={{ minWidth: 400 }}>
      <Stack spacing={3}>
        {n.map((s) => (
          <PinCard
            onClick={() => setN((n) => [...n, 0])}
            node={{
              nodeId: "0",
              children: [],
              props: {
                name: "Learn Rust!",
                content:
                  "# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!# Here your are!\n# Here your are!\n# Here your are!",
              },
            }}
          />
        ))}
      </Stack>
    </div>
  );
}
