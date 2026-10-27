const $ = id => document.getElementById(id);

const descriptions = {
  bubble:{
    title:"Bubble sort",kicker:"01 / EXCHANGE",complexity:"AVG O(n²)",
    desc:"Compare neighboring values and swap them when they are out of order.",
    explanation:"Bubble Sort repeatedly compares neighboring values. Larger values gradually move toward the end.",
    code:`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`
  },
  selection:{
    title:"Selection sort",kicker:"02 / SELECTION",complexity:"AVG O(n²)",
    desc:"Find the smallest remaining value and place it in the next position.",
    explanation:"Selection Sort searches the unsorted section for its minimum value and places it at the front.",
    code:`def selection_sort(arr):
    for i in range(len(arr)):
        minimum = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[minimum]:
                minimum = j
        arr[i], arr[minimum] = arr[minimum], arr[i]`
  },
  insertion:{
    title:"Insertion sort",kicker:"03 / INSERTION",complexity:"AVG O(n²)",
    desc:"Insert each value into its correct position in the sorted portion.",
    explanation:"Insertion Sort builds a sorted section one value at a time by shifting larger values right.",
    code:`def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key`
  },
  merge:{
    title:"Merge sort",kicker:"04 / DIVIDE & CONQUER",complexity:"AVG O(n log n)",
    desc:"Split the list into smaller parts, sort each part, and merge the results.",
    explanation:"Merge Sort divides the list into single values, then merges sorted sublists until the entire list is sorted.",
    code:`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`
  },
  quick:{
    title:"Quick sort",kicker:"05 / PARTITION",complexity:"AVG O(n log n)",
    desc:"Choose a pivot, partition values around it, and sort each side.",
    explanation:"Quick Sort chooses a pivot and partitions values into smaller and larger groups, then sorts those groups recursively.",
    code:`def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + equal + quick_sort(right)`
  }
};

let algorithm = "bubble";
let original = [];
let arr = [];
let operations = [];
let pointer = 0;
let comparisons = 0;
let swaps = 0;
let running = false;
let timer = null;

function parseInput(){
  const values=$("values").value.split(",").map(v=>v.trim()).filter(Boolean).map(Number);
  if(values.length<2 || values.length>16 || values.some(v=>!Number.isFinite(v))){
    alert("Please enter 2 to 16 valid numbers separated by commas.");
    return null;
  }
  return values;
}

function stop(){
  running=false;
  if(timer!==null){clearTimeout(timer);timer=null;}
  $("start").textContent="▶ Start sorting";
}

function updateStats(){
  $("comparisons").textContent=String(comparisons).padStart(3,"0");
  $("swaps").textContent=String(swaps).padStart(3,"0");
  $("steps").textContent=String(pointer).padStart(3,"0");
}

function renderBars(data,highlight=[],sorted=[]){
  const canvas=$("canvas");
  canvas.replaceChildren();
  const max=Math.max(...data.map(v=>Math.abs(v)),1);
  data.forEach((value,index)=>{
    const bar=document.createElement("div");
    bar.className="bar";
    if(highlight.includes(index))bar.classList.add("compare");
    else if(sorted.includes(index))bar.classList.add("sorted");
    bar.style.height=`${Math.max(35,Math.abs(value)/max*210)}px`;
    bar.textContent=value;
    bar.title=`Index ${index}: ${value}`;
    canvas.appendChild(bar);
  });
}

function addOp(type,data,compare=[],sorted=[]){
  operations.push({type,data:[...data],compare:[...compare],sorted:[...sorted]});
}

function buildOperations(input){
  operations=[];
  pointer=0;
  comparisons=0;
  swaps=0;
  const a=[...input],n=a.length;

  if(algorithm==="bubble"){
    for(let i=0;i<n;i++){
      let changed=false;
      for(let j=0;j<n-i-1;j++){
        addOp("compare",a,[j,j+1]);
        if(a[j]>a[j+1]){
          [a[j],a[j+1]]=[a[j+1],a[j]];
          addOp("swap",a,[j,j+1],Array.from({length:i},(_,k)=>n-1-k));
          changed=true;
        }
      }
      if(!changed)break;
    }
    addOp("done",a,[],Array.from({length:n},(_,i)=>i));
  }

  if(algorithm==="selection"){
    for(let i=0;i<n-1;i++){
      let min=i;
      for(let j=i+1;j<n;j++){
        addOp("compare",a,[min,j],Array.from({length:i},(_,k)=>k));
        if(a[j]<a[min])min=j;
      }
      if(min!==i){
        [a[i],a[min]]=[a[min],a[i]];
        addOp("swap",a,[i,min],Array.from({length:i},(_,k)=>k));
      }
      addOp("pass",a,[],Array.from({length:i+1},(_,k)=>k));
    }
    addOp("done",a,[],Array.from({length:n},(_,i)=>i));
  }

  if(algorithm==="insertion"){
    for(let i=1;i<n;i++){
      let j=i;
      while(j>0){
        addOp("compare",a,[j-1,j],Array.from({length:i},(_,k)=>k));
        if(a[j-1]<=a[j])break;
        [a[j-1],a[j]]=[a[j],a[j-1]];
        addOp("swap",a,[j-1,j],Array.from({length:i},(_,k)=>k));
        j--;
      }
      addOp("pass",a,[],Array.from({length:i+1},(_,k)=>k));
    }
    addOp("done",a,[],Array.from({length:n},(_,i)=>i));
  }

  if(algorithm==="merge"){
    function mergeSort(lo,hi){
      if(hi-lo<=1)return;
      const mid=Math.floor((lo+hi)/2);
      mergeSort(lo,mid);
      mergeSort(mid,hi);
      const left=a.slice(lo,mid),right=a.slice(mid,hi);
      let i=0,j=0,k=lo;
      while(i<left.length&&j<right.length){
        addOp("compare",a,[lo+i,mid+j]);
        if(left[i]<=right[j])a[k]=left[i++];
        else a[k]=right[j++];
        addOp("move",a,[k++]);
      }
      while(i<left.length){a[k]=left[i++];addOp("move",a,[k++]);}
      while(j<right.length){a[k]=right[j++];addOp("move",a,[k++]);}
      addOp("pass",a,[],Array.from({length:hi-lo},(_,x)=>lo+x));
    }
    mergeSort(0,n);
    addOp("done",a,[],Array.from({length:n},(_,i)=>i));
  }

 
  if (algorithm === "quick") {
    function quickSort(lo, hi) {
      if (lo >= hi) return;

      // Select the middle element as the pivot.
      const pivot = a[Math.floor((lo + hi) / 2)];
      let i = lo;
      let j = hi;

      // Partition the array around the pivot.
      while (i <= j) {
        while (i <= hi && a[i] < pivot) {
          addOp("compare", a, [i]);
          i++;
        }

        while (j >= lo && a[j] > pivot) {
          addOp("compare", a, [j]);
          j--;
        }

        if (i <= j) {
          addOp("compare", a, [i, j]);

          if (i !== j) {
            [a[i], a[j]] = [a[j], a[i]];
            addOp("swap", a, [i, j]);
          }

          i++;
          j--;
        }
      }

      // Recursively sort the left and right partitions.
      quickSort(lo, j);
      quickSort(i, hi);
    }

    quickSort(0, n - 1);

    addOp(
      "done",
      a,
      [],
      Array.from({ length: n }, (_, i) => i)
    );
  }

}

function applyNext(){
  if(pointer>=operations.length){stop();return false;}
  const op=operations[pointer++];
  arr=[...op.data];
  if(op.type==="compare")comparisons++;
  if(["swap","move"].includes(op.type))swaps++;
  renderBars(arr,op.compare,op.sorted);
  updateStats();
  if(pointer>=operations.length)stop();
  return true;
}

function tick(){
  if(!running)return;
  if(!applyNext())return;
  if(running)timer=setTimeout(tick,Number($("speed").value));
}

/* Divide tree */
function buildMergeTree(values){
  const node={values:[...values],children:[]};
  if(values.length<=1)return node;

  const mid=Math.ceil(values.length/2);
  node.children=[
    buildMergeTree(values.slice(0,mid)),
    buildMergeTree(values.slice(mid))
  ];
  return node;
}

/* Render Divide phase, with centered downward arrows */
function renderMergeSplit(node){
  const wrapper=document.createElement("div");
  wrapper.className="tree-pair";

  const box=document.createElement("div");
  box.className="tree-node"+(node.values.length===1?" sorted-node":"");
  box.textContent=`[${node.values.join(", ")}]`;
  wrapper.appendChild(box);

  if(node.children.length){
    const row=document.createElement("div");
    row.className="tree-level";

    node.children.forEach(child=>{
      const branch=document.createElement("div");
      branch.className="tree-pair";

      const arrow=document.createElement("div");
      arrow.className="tree-arrows";
      arrow.textContent="↓";

      branch.append(arrow,renderMergeSplit(child));
      row.appendChild(branch);
    });

    wrapper.appendChild(row);
  }

  return wrapper;
}

/* Merge two sorted lists */
function mergeSorted(left,right){
  const result=[];
  let i=0,j=0;

  while(i<left.length&&j<right.length){
    if(left[i]<=right[j])result.push(left[i++]);
    else result.push(right[j++]);
  }

  while(i<left.length)result.push(left[i++]);
  while(j<right.length)result.push(right[j++]);

  return result;
}

/*
  Build the merge stages from the same split structure as Divide.
  Each stage records the groups that are combined at that depth.
*/
function getMergeLevels(values){
  function build(list){
    if(list.length<=1){
      return {sorted:[...list],stages:[]};
    }

    const mid=Math.ceil(list.length/2);
    const left=build(list.slice(0,mid));
    const right=build(list.slice(mid));
    const merged=mergeSorted(left.sorted,right.sorted);

    const stages=[];
    const maxDepth=Math.max(left.stages.length,right.stages.length);

    for(let depth=0;depth<maxDepth;depth++){
      const groups=[];

      if(left.stages[depth])groups.push(...left.stages[depth]);
      if(right.stages[depth])groups.push(...right.stages[depth]);

      if(groups.length)stages.push(groups);
    }

    // Add this merged group after the smaller groups.
    stages.push([merged]);

    return {sorted:merged,stages};
  }

  const result=build(values);

  // Combine groups at the same depth from left and right subtrees.
  const levels=[];
  const maxDepth=Math.max(...result.stages.map(stage=>stage.length),0);

  for(let i=0;i<maxDepth;i++){
    const groups=result.stages[i]||[];
    if(groups.length)levels.push(groups);
  }

  // Use a direct bottom-up pass for reliable visible levels.
  const visible=[];
  let current=values.map(value=>[value]);

  while(current.length>1){
    const next=[];
    const mergedThisLevel=[];

    for(let i=0;i<current.length;i+=2){
      if(i+1>=current.length){
        next.push([...current[i]]);
        continue;
      }

      const merged=mergeSorted(current[i],current[i+1]);
      next.push(merged);
      mergedThisLevel.push(merged);
    }

    if(mergedThisLevel.length)visible.push(mergedThisLevel);
    current=next;
  }

  return visible;
}

/*
  Build Back Up:
  1. Show the remaining values individually.
  2. Draw a centered downward arrow for every merge group.
  3. Show sorted groups at each level.
*/
function renderMergePhase(values){
  const container=document.createElement("div");

  const label=document.createElement("div");
  label.className="trace-phase";
  label.textContent="BUILD BACK UP — MERGE SORTED GROUPS";
  container.appendChild(label);

  const note=document.createElement("p");
  note.className="trace-note";
  note.textContent=
    "Start with the individual values from Divide. Follow each downward arrow to see the sorted groups form, then merge them into larger sorted groups.";
  container.appendChild(note);

  // Show individual values once as the starting point.
  const startingLabel=document.createElement("div");
  startingLabel.className="merge-stage-label";
  startingLabel.textContent="START — INDIVIDUAL VALUES";
  container.appendChild(startingLabel);

  const startingRow=document.createElement("div");
  startingRow.className="merge-values-row";

  values.forEach(value=>{
    const column=document.createElement("div");
    column.className="merge-column";

    const box=document.createElement("div");
    box.className="tree-node sorted-node";
    box.textContent=String(value);

    column.appendChild(box);
    startingRow.appendChild(column);
  });

  container.appendChild(startingRow);

  const levels=getMergeLevels(values);

  levels.forEach((groups,index)=>{
    const stageLabel=document.createElement("div");
    stageLabel.className="merge-stage-label";
    stageLabel.textContent=`MERGE LEVEL ${index+1}`;
    container.appendChild(stageLabel);

    const stage=document.createElement("div");
    stage.className="merge-stage";

    const arrowRow=document.createElement("div");
    arrowRow.className="merge-arrow-row";

    groups.forEach(group=>{
      const column=document.createElement("div");
      column.className="merge-column";

      const arrow=document.createElement("div");
      arrow.className="tree-arrows";
      arrow.textContent="↓";

      column.appendChild(arrow);
      arrowRow.appendChild(column);
    });

    const boxRow=document.createElement("div");
    boxRow.className="merge-box-row";

    groups.forEach(group=>{
      const column=document.createElement("div");
      column.className="merge-column";

      const box=document.createElement("div");
      box.className="tree-node"+
        (group.length===values.length?" sorted-node":"");
      box.textContent=`[${group.join(", ")}]`;

      column.appendChild(box);
      boxRow.appendChild(column);
    });

    stage.append(arrowRow,boxRow);
    container.appendChild(stage);
  });

  return container;
}


/* Quick Sort: Pivot, Partition, and Recursive Calls */

function buildQuickTree(values, depth = 0) {
  if (values.length <= 1) {
    return {
      values: [...values],
      depth,
      leaf: true
    };
  }

  const pivot = values[Math.floor(values.length / 2)];

  const left = values.filter(value => value < pivot);
  const equal = values.filter(value => value === pivot);
  const right = values.filter(value => value > pivot);

  return {
    values: [...values],
    pivot,
    left,
    equal,
    right,
    depth,
    leaf: false,
    leftNode: left.length
      ? buildQuickTree(left, depth + 1)
      : null,
    rightNode: right.length
      ? buildQuickTree(right, depth + 1)
      : null
  };
}

function makeQuickValue(value, type = "") {
  const chip = document.createElement("span");
  chip.className = "quick-value";

  if (type) {
    chip.classList.add(type);
  }

  chip.textContent = value;
  return chip;
}

function makeQuickGroup(label, values, type = "") {
  const group = document.createElement("div");
  group.className = "quick-group";

  const heading = document.createElement("div");
  heading.className = "quick-group-label";
  heading.textContent = label;

  const row = document.createElement("div");
  row.className = "quick-values";

  if (values.length === 0) {
    row.appendChild(makeQuickValue("∅"));
  } else {
    values.forEach(value => {
      row.appendChild(makeQuickValue(value, type));
    });
  }

  group.append(heading, row);
  return group;
}

function makeQuickArrow(label) {
  const connector = document.createElement("div");
  connector.className = "quick-connector";

  const arrow = document.createElement("span");
  arrow.textContent = "↓";

  const caption = document.createElement("span");
  caption.textContent = label;

  connector.append(arrow, caption);
  return connector;
}

function renderQuickNode(node, container) {
  const call = document.createElement("div");
  call.className = "quick-call";

  const heading = document.createElement("div");
  heading.className = "quick-call-head";

  const title = document.createElement("span");
  title.textContent = `RECURSIVE CALL · DEPTH ${node.depth + 1}`;

  const pivotLabel = document.createElement("b");
  pivotLabel.textContent = node.leaf
    ? "BASE CASE"
    : `PIVOT = ${node.pivot}`;

  heading.append(title, pivotLabel);
  call.appendChild(heading);

  const inputRow = document.createElement("div");
  inputRow.className = "quick-values";

  node.values.forEach(value => {
    const isPivot = !node.leaf && value === node.pivot;

    inputRow.appendChild(
      makeQuickValue(value, isPivot ? "pivot" : "")
    );
  });

  call.appendChild(inputRow);

  if (node.leaf) {
    const note = document.createElement("p");
    note.className = "trace-note";
    note.style.textAlign = "center";
    note.textContent =
      "Base case: this group has at most one value, so it is already sorted.";

    call.appendChild(note);
    container.appendChild(call);
    return;
  }

  call.appendChild(makeQuickArrow("PARTITION AROUND PIVOT"));

  const groups = document.createElement("div");
  groups.className = "quick-groups";

  groups.append(
    makeQuickGroup(`LESS THAN ${node.pivot}`, node.left),
    makeQuickGroup("PIVOT VALUE(S)", node.equal, "pivot"),
    makeQuickGroup(`GREATER THAN ${node.pivot}`, node.right)
  );

  call.appendChild(groups);
  container.appendChild(call);

  if (node.leftNode) {
    const leftLabel = document.createElement("div");
    leftLabel.className = "quick-stage-title";
    leftLabel.textContent = "↓ RECURSIVELY SORT THE LEFT GROUP";

    container.appendChild(leftLabel);
    renderQuickNode(node.leftNode, container);
  }

  if (node.rightNode) {
    const rightLabel = document.createElement("div");
    rightLabel.className = "quick-stage-title";
    rightLabel.textContent = "↓ RECURSIVELY SORT THE RIGHT GROUP";

    container.appendChild(rightLabel);
    renderQuickNode(node.rightNode, container);
  }
}



function renderQuickVisualization(values) {
  const flow = document.createElement("div");
  flow.className = "quick-flow";

  const label = document.createElement("div");
  label.className = "trace-phase";
  label.textContent = "QUICK SORT — PIVOT & PARTITION";

  const note = document.createElement("p");
  note.className = "trace-note";
  note.textContent =
    "Step 1: Choose the middle value as the pivot. " +
    "Step 2: Partition the values into smaller, equal, and larger groups. " +
    "Step 3: Recursively sort the left and right groups. " +
    "Step 4: Combine the sorted groups to get the final result.";

  flow.append(label, note);

  // Render the recursive partition tree using existing functions.
  const tree = buildQuickTree(values);
  renderQuickNode(tree, flow);

  // Display the final result.
  const resultLabel = document.createElement("div");
  resultLabel.className = "quick-stage-title";
  resultLabel.textContent = "FINAL SORTED ARRAY";

  const result = document.createElement("div");
  result.className = "quick-result";

  const sortedValues = [...values].sort((a, b) => a - b);

  sortedValues.forEach(value => {
    const item = document.createElement("span");
    item.className = "quick-value sorted";
    item.textContent = value;
    result.appendChild(item);
  });

  flow.append(resultLabel, result);

  return flow;
}




function addTraceRow(title,text){
  const row=document.createElement("div");
  row.className="trace-row";

  const strong=document.createElement("strong");
  strong.textContent=title;

  const span=document.createElement("span");
  span.textContent=text;

  row.append(strong,span);
  $("trace-steps").appendChild(row);
}

function renderTrace(){
  const isTree=algorithm==="merge"||algorithm==="quick";

  $("trace-panel").classList.toggle("hidden",!isTree);
  $("canvas").classList.toggle("hidden",isTree);

  if(!isTree)return;

  $("tree").replaceChildren();
  $("trace-steps").replaceChildren();

  if(algorithm==="merge"){
    $("trace-title").textContent="Merge Sort — Divide & Merge";
    $("trace-count").textContent="SPLIT + MERGE";
    $("trace-note").textContent=
      "Divide splits the list down to individual values. Build Back Up shows the individual values and then each sorted merge level.";

    const splitLabel=document.createElement("div");
    splitLabel.className="trace-phase";
    splitLabel.textContent="DIVIDE PHASE — SPLIT DOWN";

    $("tree").appendChild(splitLabel);
    $("tree").appendChild(renderMergeSplit(buildMergeTree(original)));
    $("tree").appendChild(renderMergePhase(original));

    addTraceRow("01 / DIVIDE",
      `Original list: [${original.join(", ")}]. Repeatedly split each list into smaller sublists.`);

    addTraceRow("02 / SINGLE VALUES",
      "The Divide tree ends with individual values. Build Back Up uses these as its starting point.");

    addTraceRow("03 / BUILD BACK UP",
      "Merge neighboring groups in sorted order. Each new level displays the groups created at that stage.");

    addTraceRow("04 / RESULT",
      `Sorted list: [${[...original].sort((a,b)=>a-b).join(", ")}].`);
  
  } else {
    $("trace-title").textContent =
      "Quick Sort — Pivot & Partition";

    $("trace-count").textContent =
      "RECURSIVE PARTITIONS";

    $("trace-note").textContent =
      "Follow the pivot and partition groups through each recursive call.";

    $("tree").appendChild(
      renderQuickVisualization(original)
    );

    addTraceRow(
      "01 / CHOOSE PIVOT",
      "The middle value of each subarray is selected as its pivot."
    );

    addTraceRow(
      "02 / PARTITION",
      "Values smaller than the pivot go left, equal values stay in the pivot group, and larger values go right."
    );

    addTraceRow(
      "03 / RECURSION",
      "Repeat the same process for the non-empty left and right groups until each group contains at most one value."
    );

    addTraceRow(
      "04 / RESULT",
      `Sorted list: [${[...original]
        .sort((a, b) => a - b)
        .join(", ")}].`
    );
  }
}


function prepare(){
  stop();

  const data=parseInput();
  if(!data)return false;

  original=[...data];
  arr=[...data];
  buildOperations(original);
  renderBars(arr);
  updateStats();
  renderTrace();

  return true;
}

document.querySelectorAll(".alg").forEach(button=>{
  button.addEventListener("click",()=>{
    algorithm=button.dataset.alg;

    document.querySelectorAll(".alg").forEach(b=>
      b.classList.toggle("active",b===button)
    );

    const info=descriptions[algorithm];

    $("alg-title").textContent=info.title;
    $("alg-kicker").textContent=info.kicker;
    $("alg-complexity").textContent=info.complexity;
    $("alg-desc").textContent=info.desc;
    $("explanation").textContent=info.explanation;
    $("code").textContent=info.code;

    prepare();
  });
});

$("start").addEventListener("click",()=>{
  if(running){
    stop();
    return;
  }

  if(pointer>=operations.length&&!prepare())return;

  running=true;
  $("start").textContent="Ⅱ Pause";
  tick();
});

$("step").addEventListener("click",()=>{
  stop();

  if(pointer>=operations.length&&!prepare())return;

  applyNext();
});

$("reset").addEventListener("click",prepare);
$("values").addEventListener("change",prepare);

$("shuffle").addEventListener("click",()=>{
  const data=parseInput();
  if(!data)return;

  for(let i=data.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [data[i],data[j]]=[data[j],data[i]];
  }

  $("values").value=data.join(", ");
  prepare();
});

$("code").textContent=descriptions.bubble.code;
prepare();