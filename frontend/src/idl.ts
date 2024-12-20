export const IDL = {
  address: "E9JvpKoPBCFP8Y5h2XLnRk8EintPJE43AF7Rk5G6DnKx",
  metadata: {
    name: "crowdfunding",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "create",
      discriminator: [24, 30, 200, 40, 5, 28, 7, 119],
      accounts: [
        {
          name: "campaign",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [67, 65, 77, 80, 65, 73, 71, 78, 95, 68, 69, 77, 79],
              },
              {
                kind: "account",
                path: "user",
              },
            ],
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
      ],
    },
    {
      name: "donate",
      discriminator: [121, 186, 218, 211, 73, 70, 196, 180],
      accounts: [
        {
          name: "campaign",
          writable: true,
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        {
          name: "campaign",
          writable: true,
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Campaign",
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192],
    },
  ],
  types: [
    {
      name: "Campaign",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "amount_donated",
            type: "u64",
          },
          {
            name: "admin",
            type: "pubkey",
          },
        ],
      },
    },
  ],
};

/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crowdfunding.json`.
 */
export type Crowdfunding = {
  address: "E9JvpKoPBCFP8Y5h2XLnRk8EintPJE43AF7Rk5G6DnKx";
  metadata: {
    name: "crowdfunding";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "create";
      discriminator: [24, 30, 200, 40, 5, 28, 7, 119];
      accounts: [
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [67, 65, 77, 80, 65, 73, 71, 78, 95, 68, 69, 77, 79];
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        }
      ];
    },
    {
      name: "donate";
      discriminator: [121, 186, 218, 211, 73, 70, 196, 180];
      accounts: [
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "user";
          writable: true;
          signer: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "campaign";
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192];
    }
  ];
  types: [
    {
      name: "campaign";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "amountDonated";
            type: "u64";
          },
          {
            name: "admin";
            type: "pubkey";
          }
        ];
      };
    }
  ];
};
