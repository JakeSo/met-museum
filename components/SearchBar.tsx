"use client";

import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchChip } from "@/components/ui/Chip";
import { SearchField } from "@/components/ui/Field";
import DepartmentCombobox from "@/components/ui/DepartmentCombobox";
import { useSearchState } from "@/lib/hooks/useSearchState";

const SCOPE_CHIPS = [
  { key: "title", label: "Title" },
  { key: "tags", label: "Tags" },
  { key: "artistOrCulture", label: "Artist / Culture" },
];

const FILTER_CHIPS = [
  { key: "isHighlight", label: "Highlights" },
  { key: "isOnView", label: "On View" },
  { key: "hasImages", label: "Has Images" },
];

export default function SearchBar() {
  const {
    query,
    setQuery,
    scope,
    setScope,
    filterFlags,
    setFilterFlags,
    medium,
    setMedium,
    geoLocation,
    setGeoLocation,
    departmentId,
    setDepartmentId,
    dateBegin,
    setDateBegin,
    dateEnd,
    setDateEnd,
    showAdvanced,
    setShowAdvanced,
    toggleFlag,
    hasActiveFilters,
    isPending,
    submit,
    clear,
  } = useSearchState();

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-150 mx-auto space-y-3 border-b-2 pb-6"
    >
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search the collection…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="xs" disabled={isPending}>
            {isPending ? "Searching…" : "Search"}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-col gap-2">
        <div
          role="group"
          aria-labelledby="search-scope-label"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span id="search-scope-label" className="text-muted-foreground">
            Search in
          </span>
          {SCOPE_CHIPS.map(({ key, label }) => (
            <SearchChip
              key={key}
              active={scope === key}
              onClick={() => setScope(key as "title" | "tags" | "artistOrCulture")}
            >
              {label}
            </SearchChip>
          ))}
        </div>

        <div
          role="group"
          aria-labelledby="search-filter-label"
          className="flex flex-wrap items-center gap-1.5"
        >
          <span id="search-filter-label" className="text-muted-foreground">
            Filter
          </span>
          {FILTER_CHIPS.map(({ key, label }) => (
            <SearchChip
              key={key}
              active={!!filterFlags[key]}
              onClick={() => toggleFlag(filterFlags, setFilterFlags, key)}
            >
              {label}
            </SearchChip>
          ))}
          <SearchChip
            active={showAdvanced}
            onClick={() => setShowAdvanced((v) => !v)}
            className="ml-auto"
          >
            {showAdvanced ? "Fewer filters" : "More filters"}
          </SearchChip>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <SearchField
            label="Medium"
            hint="comma-separated"
            htmlFor="search-medium"
          >
            <Input
              id="search-medium"
              placeholder="e.g. Oil on canvas"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="h-8"
            />
          </SearchField>
          <SearchField
            label="Geographic location"
            hint="comma-separated"
            htmlFor="search-geo-location"
          >
            <Input
              id="search-geo-location"
              placeholder="e.g. France, Paris"
              value={geoLocation}
              onChange={(e) => setGeoLocation(e.target.value)}
              className="h-8"
            />
          </SearchField>
          <SearchField label="Department" htmlFor="search-department">
            <DepartmentCombobox
              selectedDeptId={departmentId}
              setSelectedDeptId={setDepartmentId}
            />
          </SearchField>
          <SearchField label="Date from" htmlFor="search-date-begin">
            <Input
              id="search-date-begin"
              type="number"
              placeholder="e.g. -500"
              value={dateBegin}
              onChange={(e) => setDateBegin(e.target.value)}
              className="h-8"
            />
          </SearchField>
          <SearchField label="Date to" htmlFor="search-date-end">
            <Input
              id="search-date-end"
              type="number"
              placeholder="e.g. 1900"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="h-8"
            />
          </SearchField>
        </div>
      )}
    </form>
  );
}
