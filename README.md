# Probabilist

## Introduction

This project is made in collaboration with the awesome developers:

- Mohammed El Fawwal
- Mahmoud Shabbour
- Mostafa El Sayed
- Abu Saif

Hey yo, See the [details](#details), [guidelines](#guidelines) sections below.

Our goal is make a reliable tool that will help mathematicians work with probability.

## Prerequisites

You should only have [nodejs](https://nodejs.org/en) installed.

## Getting started

```bash
# Copy the .env.example file to .env
cp .env.example .env # Linux command

# Clone the repo
git clone https://github.com/osama-mhmd/probabilist

# Install the debs.
pnpm install --prefer-offline

# Run the dev server
pnpm run dev

# Checkout for a PR
git checkout -b feature/[...feature...]

# Commit changes
git commit -m "feat/fix: ..."

# Push changes
git push --set-upstream origin $(git_current_branch) # Instead of writing your branch name
# OR
git push --set-upstream origin feature/[...feature...]

# Finally create a PR (Pull request) from GitHub
```

## Guidelines

### Using AI

Any AI model used, should strictly follow the guidelines at AGENTS.md. If you're using a AI model, make sure to give him the MD File for better results.

### Nomenclature

**Branches**:

- Dashboard: `feature/dashboard`
- Preview: `feature/preview`
- Homepage: `feature/homepage`
- Computations/transformations: `feature/logic`

## Details

### How to work on transformation/computation

All you have to do is to write your code in the `src/lib/math/index.ts` file, and also in the `src/lib/data/index.ts` file.

I mocked the functions in the `src/lib/math/index.ts` file, and the `src/lib/data/index.ts` file.

You can use the `transformCSV` function to transform the CSV data into the `StatisticalDistribution` object.

You can use the `transformExcel` function to transform the Excel data into the `StatisticalDistribution` object.

You can use the `getbionomialDistribution` function to calculate the probability of getting a `k` heads in `n` coin tosses.

You can use the `getVariance` function to calculate the variance of the probability of getting a `k` heads in `n` coin tosses.

The transformed `data` should look like the following:

```ts
{
  sector: 'engineering' | 'medicine'

  n: number
  p: number | number[]
  k: number
}
```

For example, if the user wants to calculate the probability of getting a `k` heads in `n` coin tosses, the `p` value will be `1` and the `n` value will be `k`.

If the user wants to calculate the probability of getting a `k` heads in `n` coin tosses, the `p` value will be `1` and the `n` value will be `k`.

### How to work on the homepage

All you have to do is to write your code in the `src/routes/index.tsx` file.

### How to work on the preview page

All you have to do is to write your code in the `src/routes/preview/index.tsx` file.

The preview page primary goal is to show the user three options (manual input, CSV, Excel) to transform the data into the `StatisticalDistribution` object.

So, you will get the data from the user, call the `transformCSV` function for CSV, and call the `transformExcel` function for Excel.

After that, set the store with the transformed data, as the following:

```ts
import { setTransformedTasks } from '@/stores/data.store'

setTransformedTasks(tasks)
```

And then redirect the user to the dashboard page.
