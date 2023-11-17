export default function parseMetaObject(text)
{
    let result = {};
    if (!text)
    {
        return result;
    }

    let objStack = 0;
    let inString = false;
    let inKey = true;
    let inValue = false;
    let escapeNext = false;
    let currentKey = "";
    let currentValue = "";
    let ignoreUntilSpace = false;
    text = text + " ";

    for (let i=0; i< text.length; i++)
    {
        let curr = text[i];

        // following is next property
        if (curr == ' ' && objStack == 0 && !inString  && currentKey.length > 0)
        {
            if (inKey) {
                result[currentKey] = true;
            }
            if (inValue && !ignoreUntilSpace) {
                result[currentKey] = currentValue;
            }
            inKey = true;
            inValue = false;
            currentKey = "";
            currentValue = "";
            ignoreUntilSpace = false;
            continue;
        }

        if (ignoreUntilSpace)
        {
            continue;
        }

        // Errors states:

        if (curr == '\'' && inKey)
        {
            throw new Error(`Quoted strings are not allowed in keys.\npos: ${i}\nkey: ${currentKey}\ninput: ${text}`);
        }

        if (curr == ')' && inKey)
        {
            throw new Error(`Sub-object termination is not allowed in keys.\npos: ${i}\nkey: ${currentKey}\ninput: ${text}`);
        }

        if (curr == '^' && inKey)
        {
            throw new Error(`Escape sequences are not allowed in keys.\npos: ${i}\nkey: ${currentKey}\ninput: ${text}`);
        }

        if (curr == '.' && inKey)
        {
            throw new Error(`Dots are not allowed in keys.\npos: ${i}\nkey: ${currentKey}\ninput: ${text}`);
        }

        // following is value
        if (curr == ':' && objStack == 0 && !inValue && !inString && inKey)
        {
            inKey = false;
            inValue = true;
            continue;
        }

        // following is subobject
        if (curr == '(' && objStack == 0 && !inValue && !inString && inKey)
        {
            inKey = false;
            inValue = true;
            objStack++;
            continue;
        }

        // following is sub-subobject
        if (curr == '(' && !inString && objStack > 0)
        {
            currentValue += curr;
            objStack++;
            continue;
        }

        // closing a subobject
        if (curr == ')' && !inString && objStack > 0)
        {
            objStack--;
            if (objStack > 0)
                currentValue += curr;
            else {
                result[currentKey] = parseMetaObject(currentValue);
                ignoreUntilSpace = true;
            }
            continue;
        }

        if (curr == '^' && !escapeNext)
        {
            escapeNext = true;
            continue;
        }

        // opening or closing a string
        if (curr == '\'' && !escapeNext)
        {
            inString = !inString;
            if (objStack > 0)
                currentValue += curr;

            continue;
        }

        if (inValue)
        {
            currentValue += curr;
        }

        if (inKey)
        {
            currentKey += curr;
        }

        escapeNext = false;
    }

    // Errors states:

    if (objStack != 0)
    {
        throw new Error(`Not all sub-objects have been terminated.\ninput: ${text}`);
    }

    if (inString)
    {
        throw new Error(`Not all strings been terminated.\ninput: ${text}`);
    }

    return result;
}